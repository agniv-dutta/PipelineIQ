from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models import (
    Company as CompanyModel,
    Campaign as CampaignModel,
    Lead as LeadModel,
    AttributionResult as AttributionResultModel
)
from app.ml.deal_probability import DealProbabilityService
from app.ml.budget_optimization import BudgetOptimizationService

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/overview/{company_id}")
def get_dashboard_overview(company_id: int, model: str = "linear", db: Session = Depends(get_db)):
    """Get KPI overview for dashboard"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Total ad spend
    total_spend = db.query(func.sum(CampaignModel.cost)).filter(
        CampaignModel.company_id == company_id
    ).scalar() or 0.0
    
    # Total pipeline value
    total_pipeline_value = db.query(func.sum(LeadModel.deal_value)).filter(
        LeadModel.company_id == company_id
    ).scalar() or 0.0
    
    # Revenue attributed (using specified model)
    total_attributed_revenue = db.query(func.sum(AttributionResultModel.attributed_revenue)).filter(
        AttributionResultModel.attribution_model == model
    ).scalar() or 0.0
    
    # ROAS
    roas = (total_attributed_revenue / total_spend) if total_spend > 0 else 0.0
    
    # CAC
    num_leads = db.query(func.count(LeadModel.id)).filter(
        LeadModel.company_id == company_id
    ).scalar() or 0
    cac = (total_spend / num_leads) if num_leads > 0 else 0.0
    
    # Number of campaigns
    num_campaigns = db.query(func.count(CampaignModel.id)).filter(
        CampaignModel.company_id == company_id
    ).scalar() or 0
    
    # Conversion rate
    num_won = db.query(func.count(LeadModel.id)).filter(
        LeadModel.company_id == company_id,
        LeadModel.stage == "Won"
    ).scalar() or 0
    conversion_rate = (num_won / num_leads * 100) if num_leads > 0 else 0.0
    
    return {
        "company_id": company_id,
        "company_name": company.name,
        "total_ad_spend": float(total_spend),
        "pipeline_value": float(total_pipeline_value),
        "revenue_attributed": float(total_attributed_revenue),
        "roas": float(round(roas, 2)),
        "cac": float(round(cac, 2)),
        "num_campaigns": num_campaigns,
        "num_leads": num_leads,
        "conversion_rate": float(round(conversion_rate, 2)),
        "num_conversions": num_won,
    }

@router.get("/funnel/{company_id}")
def get_funnel_data(company_id: int, db: Session = Depends(get_db)):
    """Get lead funnel data"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    stages = ["MQL", "SQL", "Opportunity", "Won", "Lost"]
    funnel_data = []
    
    for stage in stages:
        count = db.query(func.count(LeadModel.id)).filter(
            LeadModel.company_id == company_id,
            LeadModel.stage == stage
        ).scalar() or 0
        
        value = db.query(func.sum(LeadModel.deal_value)).filter(
            LeadModel.company_id == company_id,
            LeadModel.stage == stage
        ).scalar() or 0.0
        
        funnel_data.append({
            "stage": stage,
            "count": count,
            "value": float(value)
        })
    
    return {"company_id": company_id, "funnel": funnel_data}

@router.get("/revenue-by-channel/{company_id}")
def get_revenue_by_channel(company_id: int, model: str = "linear", db: Session = Depends(get_db)):
    """Get attributed revenue by marketing channel"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    results = db.query(
        CampaignModel.platform,
        func.sum(AttributionResultModel.attributed_revenue).label("total_revenue"),
        func.sum(CampaignModel.cost).label("total_spend"),
        func.count(CampaignModel.id).label("num_campaigns")
    ).join(
        AttributionResultModel, CampaignModel.id == AttributionResultModel.campaign_id, isouter=True
    ).filter(
        CampaignModel.company_id == company_id,
        AttributionResultModel.attribution_model == model
    ).group_by(CampaignModel.platform).all()
    
    channel_data = []
    for platform, revenue, spend, num_campaigns in results:
        channel_data.append({
            "platform": platform or "Unknown",
            "attributed_revenue": float(revenue) if revenue else 0.0,
            "spend": float(spend) if spend else 0.0,
            "num_campaigns": num_campaigns or 0
        })
    
    return {"company_id": company_id, "channels": channel_data}

@router.get("/top-campaigns/{company_id}")
def get_top_campaigns(company_id: int, limit: int = 5, db: Session = Depends(get_db)):
    """Get top campaigns by ROAS"""
    campaigns = db.query(CampaignModel).filter(
        CampaignModel.company_id == company_id
    ).all()
    
    campaign_data = []
    for campaign in campaigns:
        # Get attributed revenue
        attributed_revenue = db.query(func.sum(AttributionResultModel.attributed_revenue)).filter(
            AttributionResultModel.campaign_id == campaign.id
        ).scalar() or 0.0
        
        # Calculate ROAS
        roas = (attributed_revenue / campaign.cost) if campaign.cost > 0 else 0.0
        
        # Count leads
        num_leads = db.query(func.count(LeadModel.id)).filter(
            LeadModel.source_campaign_id == campaign.id
        ).scalar() or 0
        
        campaign_data.append({
            "campaign_id": campaign.id,
            "campaign_name": campaign.name,
            "platform": campaign.platform,
            "spend": campaign.cost,
            "attributed_revenue": float(attributed_revenue),
            "roas": float(round(roas, 2)),
            "num_leads": num_leads
        })
    
    # Sort by ROAS
    campaign_data.sort(key=lambda x: x["roas"], reverse=True)
    
    return {
        "company_id": company_id,
        "campaigns": campaign_data[:limit]
    }

@router.get("/deal-probability/{company_id}")
def get_deal_probabilities(company_id: int, db: Session = Depends(get_db)):
    """Get deal probability scores for all leads"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Train model if needed
    DealProbabilityService.train_model(db)
    
    # Get high probability leads
    high_prob_leads = DealProbabilityService.get_high_probability_leads(50, db)
    
    return {
        "company_id": company_id,
        "high_probability_leads": high_prob_leads[:10]
    }

@router.get("/budget-optimization/{company_id}")
def get_budget_recommendations(company_id: int, db: Session = Depends(get_db)):
    """Get budget optimization recommendations"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    recommendations = BudgetOptimizationService.get_optimization_recommendations(company_id, db)
    metrics = BudgetOptimizationService.get_campaign_metrics(company_id, db)
    
    return {
        "company_id": company_id,
        "recommendations": recommendations,
        "campaign_metrics": metrics
    }
