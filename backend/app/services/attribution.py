from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models import Lead, Campaign, AttributionResult
from datetime import datetime, timedelta
from typing import List, Dict
import math

class AttributionService:
    """Service for multi-touch attribution models"""
    
    @staticmethod
    def calculate_linear_attribution(lead_id: int, db: Session) -> Dict:
        """
        Linear Attribution: Equal weight to all touchpoints
        """
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead or not lead.touchpoints:
            return {"model": "linear", "results": []}
        
        results = []
        num_touchpoints = len(lead.touchpoints)
        weight_per_touch = 1.0 / num_touchpoints if num_touchpoints > 0 else 0
        attributed_revenue = lead.deal_value * weight_per_touch
        
        for campaign_id in lead.touchpoints:
            result = AttributionResult(
                lead_id=lead_id,
                campaign_id=campaign_id,
                attribution_model="linear",
                weighted_attribution=weight_per_touch,
                attributed_revenue=attributed_revenue,
            )
            results.append(result)
        
        return {"model": "linear", "results": results}
    
    @staticmethod
    def calculate_first_touch_attribution(lead_id: int, db: Session) -> Dict:
        """
        First-Touch Attribution: 100% credit to first touchpoint
        """
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead or not lead.touchpoints:
            return {"model": "first_touch", "results": []}
        
        results = []
        first_campaign_id = lead.touchpoints[0]
        
        for i, campaign_id in enumerate(lead.touchpoints):
            weight = 1.0 if i == 0 else 0.0
            attributed_revenue = lead.deal_value if i == 0 else 0.0
            
            result = AttributionResult(
                lead_id=lead_id,
                campaign_id=campaign_id,
                attribution_model="first_touch",
                weighted_attribution=weight,
                attributed_revenue=attributed_revenue,
            )
            results.append(result)
        
        return {"model": "first_touch", "results": results}
    
    @staticmethod
    def calculate_last_touch_attribution(lead_id: int, db: Session) -> Dict:
        """
        Last-Touch Attribution: 100% credit to last touchpoint
        """
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead or not lead.touchpoints:
            return {"model": "last_touch", "results": []}
        
        results = []
        for i, campaign_id in enumerate(lead.touchpoints):
            weight = 1.0 if i == len(lead.touchpoints) - 1 else 0.0
            attributed_revenue = lead.deal_value if i == len(lead.touchpoints) - 1 else 0.0
            
            result = AttributionResult(
                lead_id=lead_id,
                campaign_id=campaign_id,
                attribution_model="last_touch",
                weighted_attribution=weight,
                attributed_revenue=attributed_revenue,
            )
            results.append(result)
        
        return {"model": "last_touch", "results": results}
    
    @staticmethod
    def calculate_time_decay_attribution(lead_id: int, db: Session, decay_rate: float = 0.5) -> Dict:
        """
        Time-Decay Attribution: Weight increases closer to conversion
        Uses exponential decay function
        """
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead or not lead.touchpoints:
            return {"model": "time_decay", "results": []}
        
        results = []
        num_touchpoints = len(lead.touchpoints)
        
        # Calculate time decay weights
        weights = []
        for i in range(num_touchpoints):
            # Weight increases towards the end
            weight = (decay_rate ** (num_touchpoints - 1 - i))
            weights.append(weight)
        
        # Normalize weights to sum to 1
        total_weight = sum(weights)
        normalized_weights = [w / total_weight for w in weights]
        
        for i, campaign_id in enumerate(lead.touchpoints):
            weight = normalized_weights[i]
            attributed_revenue = lead.deal_value * weight
            
            result = AttributionResult(
                lead_id=lead_id,
                campaign_id=campaign_id,
                attribution_model="time_decay",
                weighted_attribution=weight,
                attributed_revenue=attributed_revenue,
            )
            results.append(result)
        
        return {"model": "time_decay", "results": results}
    
    @staticmethod
    def save_attribution_results(db: Session, results: List[AttributionResult]) -> None:
        """Save attribution results to database"""
        # Delete existing results for this lead and model
        if results:
            lead_id = results[0].lead_id
            model = results[0].attribution_model
            db.query(AttributionResult).filter(
                and_(
                    AttributionResult.lead_id == lead_id,
                    AttributionResult.attribution_model == model
                )
            ).delete()
        
        for result in results:
            db.add(result)
        db.commit()
    
    @staticmethod
    def calculate_attribution_for_lead(lead_id: int, model: str, db: Session) -> Dict:
        """
        Main method to calculate attribution for a lead using specified model
        """
        if model == "linear":
            return AttributionService.calculate_linear_attribution(lead_id, db)
        elif model == "first_touch":
            return AttributionService.calculate_first_touch_attribution(lead_id, db)
        elif model == "last_touch":
            return AttributionService.calculate_last_touch_attribution(lead_id, db)
        elif model == "time_decay":
            return AttributionService.calculate_time_decay_attribution(lead_id, db)
        else:
            return {"model": model, "results": []}
    
    @staticmethod
    def get_attributed_revenue_by_campaign(company_id: int, model: str, db: Session) -> Dict:
        """Get total attributed revenue by campaign"""
        results = db.query(
            Campaign.id,
            Campaign.name,
            Campaign.platform,
            func.sum(AttributionResult.attributed_revenue).label("total_attributed_revenue")
        ).join(
            AttributionResult, Campaign.id == AttributionResult.campaign_id
        ).filter(
            and_(
                Campaign.company_id == company_id,
                AttributionResult.attribution_model == model
            )
        ).group_by(Campaign.id, Campaign.name, Campaign.platform).all()
        
        return {
            "model": model,
            "data": [
                {
                    "campaign_id": r[0],
                    "campaign_name": r[1],
                    "platform": r[2],
                    "attributed_revenue": float(r[3]) if r[3] else 0.0
                } for r in results
            ]
        }
