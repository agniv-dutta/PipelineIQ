from typing import Dict, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Campaign, AttributionResult, Lead
import math

class BudgetOptimizationService:
    """Service for budget optimization recommendations"""
    
    @staticmethod
    def calculate_roas(revenue: float, spend: float) -> float:
        """Calculate Return On Ad Spend"""
        if spend == 0:
            return 0.0
        return revenue / spend
    
    @staticmethod
    def calculate_cac(spend: float, num_leads: int) -> float:
        """Calculate Customer Acquisition Cost"""
        if num_leads == 0:
            return spend
        return spend / num_leads
    
    @staticmethod
    def get_campaign_metrics(company_id: int, db: Session) -> List[Dict]:
        """Get metrics for all campaigns"""
        campaigns = db.query(Campaign).filter(Campaign.company_id == company_id).all()
        metrics = []
        
        for campaign in campaigns:
            # Count leads
            num_leads = db.query(Lead).filter(Lead.source_campaign_id == campaign.id).count()
            
            # Get attributed revenue
            attributed_revenue = db.query(func.sum(AttributionResult.attributed_revenue)).filter(
                AttributionResult.campaign_id == campaign.id
            ).scalar() or 0.0
            
            # Count conversions (Won leads)
            num_conversions = db.query(Lead).filter(
                Lead.source_campaign_id == campaign.id,
                Lead.stage == "Won"
            ).count()
            
            # Calculate metrics
            roas = BudgetOptimizationService.calculate_roas(float(attributed_revenue), campaign.cost)
            cac = BudgetOptimizationService.calculate_cac(campaign.cost, num_leads)
            
            # Calculate CTR and CPC
            ctr = (campaign.clicks / campaign.impressions * 100) if campaign.impressions > 0 else 0.0
            cpc = (campaign.cost / campaign.clicks) if campaign.clicks > 0 else 0.0
            
            metrics.append({
                "campaign_id": campaign.id,
                "campaign_name": campaign.name,
                "platform": campaign.platform,
                "budget": campaign.budget,
                "spend": campaign.cost,
                "impressions": campaign.impressions,
                "clicks": campaign.clicks,
                "ctr": ctr,
                "cpc": cpc,
                "num_leads": num_leads,
                "num_conversions": num_conversions,
                "attributed_revenue": float(attributed_revenue),
                "roas": roas,
                "cac": cac,
            })
        
        return metrics
    
    @staticmethod
    def get_optimization_recommendations(company_id: int, db: Session) -> List[Dict]:
        """Generate budget optimization recommendations"""
        metrics = BudgetOptimizationService.get_campaign_metrics(company_id, db)
        recommendations = []
        
        if not metrics:
            return recommendations
        
        # Calculate averages
        avg_roas = sum(m["roas"] for m in metrics) / len(metrics)
        avg_cac = sum(m["cac"] for m in metrics) / len(metrics)
        
        for campaign in metrics:
            # Empty campaigns
            if campaign["spend"] == 0:
                recommendations.append({
                    "campaign_id": campaign["campaign_id"],
                    "campaign_name": campaign["campaign_name"],
                    "recommendation": "Launch Campaign",
                    "action": f"This campaign has no spend yet. Consider allocating budget.",
                    "confidence": 0.7,
                    "priority": "low"
                })
                continue
            
            # High ROAS campaigns - increase budget
            if campaign["roas"] > avg_roas * 1.5:
                increase_pct = min(50, 20 + int((campaign["roas"] - avg_roas) / avg_roas * 10))
                recommendations.append({
                    "campaign_id": campaign["campaign_id"],
                    "campaign_name": campaign["campaign_name"],
                    "recommendation": "Increase Budget",
                    "action": f"This campaign has {increase_pct}% above-average ROAS. Increase budget by {increase_pct}%",
                    "target_budget": campaign["budget"] * (1 + increase_pct / 100),
                    "confidence": 0.85,
                    "priority": "high"
                })
            
            # Low ROAS campaigns - reduce budget
            elif campaign["roas"] < avg_roas * 0.7:
                if campaign["num_conversions"] < 1:
                    recommendations.append({
                        "campaign_id": campaign["campaign_id"],
                        "campaign_name": campaign["campaign_name"],
                        "recommendation": "Reduce or Pause Campaign",
                        "action": f"Low ROAS {campaign['roas']:.2f} with minimal conversions. Consider pausing or reallocating.",
                        "confidence": 0.8,
                        "priority": "high"
                    })
                else:
                    reduction_pct = min(50, int((avg_roas - campaign["roas"]) / avg_roas * 30))
                    recommendations.append({
                        "campaign_id": campaign["campaign_id"],
                        "campaign_name": campaign["campaign_name"],
                        "recommendation": "Reduce Budget",
                        "action": f"ROAS is {reduction_pct}% below average. Reduce budget by {reduction_pct}%",
                        "target_budget": campaign["budget"] * (1 - reduction_pct / 100),
                        "confidence": 0.75,
                        "priority": "medium"
                    })
            
            # High performing segment
            if campaign["roas"] > 2.0 and campaign["num_conversions"] >= 2:
                recommendations.append({
                    "campaign_id": campaign["campaign_id"],
                    "campaign_name": campaign["campaign_name"],
                    "recommendation": "High-Performing Segment",
                    "action": f"Excellent ROAS of {campaign['roas']:.2f}. This is a high-performing segment - test expanding audience.",
                    "confidence": 0.9,
                    "priority": "high"
                })
            
            # CAC optimization
            if campaign["cac"] < avg_cac * 0.5:
                recommendations.append({
                    "campaign_id": campaign["campaign_id"],
                    "campaign_name": campaign["campaign_name"],
                    "recommendation": "Efficient Acquisition",
                    "action": f"CAC is 50% below average. Consider scaling this channel.",
                    "confidence": 0.8,
                    "priority": "medium"
                })
            
            # Low CTR campaigns
            if campaign["ctr"] < 0.5 and campaign["impressions"] > 1000:
                recommendations.append({
                    "campaign_id": campaign["campaign_id"],
                    "campaign_name": campaign["campaign_name"],
                    "recommendation": "Improve Ad Creative",
                    "action": f"Low CTR of {campaign['ctr']:.2f}%. Test new creative or audience targeting.",
                    "confidence": 0.7,
                    "priority": "medium"
                })
        
        # Remove duplicates and sort by priority
        unique_keys = set()
        unique_recommendations = []
        for rec in recommendations:
            key = (rec["campaign_id"], rec["recommendation"])
            if key not in unique_keys:
                unique_keys.add(key)
                unique_recommendations.append(rec)
        
        priority_order = {"high": 0, "medium": 1, "low": 2}
        unique_recommendations.sort(key=lambda x: (priority_order.get(x.get("priority", "low"), 3), -x.get("confidence", 0)))
        
        return unique_recommendations[:10]  # Top 10 recommendations
