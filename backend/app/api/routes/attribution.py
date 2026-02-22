from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.db.database import get_db
from app.schemas.attribution import AttributionResult
from app.models import (
    Lead as LeadModel,
    Campaign as CampaignModel,
    Company as CompanyModel,
    AttributionResult as AttributionResultModel
)
from app.services.attribution import AttributionService

router = APIRouter(prefix="/api/attribution", tags=["attribution"])

@router.post("/calculate/{lead_id}")
def calculate_attribution(
    lead_id: int,
    model: str = "linear",
    db: Session = Depends(get_db)
):
    """Calculate attribution for a lead using specified model"""
    lead = db.query(LeadModel).filter(LeadModel.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    if model not in ["linear", "first_touch", "last_touch", "time_decay"]:
        raise HTTPException(status_code=400, detail="Invalid attribution model")
    
    # Calculate attribution
    result = AttributionService.calculate_attribution_for_lead(lead_id, model, db)
    
    # Save results
    if result["results"]:
        AttributionService.save_attribution_results(db, result["results"])
    
    return {
        "lead_id": lead_id,
        "model": model,
        "attribution_count": len(result["results"]),
        "results": [
            {
                "campaign_id": r.campaign_id,
                "weighted_attribution": r.weighted_attribution,
                "attributed_revenue": r.attributed_revenue
            } for r in result["results"]
        ]
    }

@router.get("/revenue/{company_id}")
def get_revenue_by_campaign(
    company_id: int,
    model: str = "linear",
    db: Session = Depends(get_db)
):
    """Get attributed revenue by campaign"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    return AttributionService.get_attributed_revenue_by_campaign(company_id, model, db)

@router.get("/summary/{company_id}")
def get_attribution_summary(
    company_id: int,
    db: Session = Depends(get_db)
):
    """Get complete attribution summary for company"""
    company = db.query(CompanyModel).filter(CompanyModel.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Get total attributed revenue by model
    models = ["linear", "first_touch", "last_touch", "time_decay"]
    summary = {}
    
    for model in models:
        total_revenue = db.query(func.sum(AttributionResultModel.attributed_revenue)).filter(
            AttributionResultModel.attribution_model == model
        ).scalar() or 0.0
        
        summary[model] = {
            "total_attributed_revenue": float(total_revenue),
            "leads_attributed": db.query(func.count(AttributionResultModel.id)).filter(
                AttributionResultModel.attribution_model == model
            ).scalar() or 0
        }
    
    return {
        "company_id": company_id,
        "company_name": company.name,
        "attribution_summary": summary
    }
