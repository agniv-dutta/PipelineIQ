import pickle
import os
from typing import Dict, List
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sqlalchemy.orm import Session
from app.models import Lead, Campaign, Company
from datetime import datetime

class DealProbabilityService:
    """Service for AI-based deal probability scoring"""
    
    MODEL_PATH = "app/ml/models/deal_probability_model.pkl"
    SCALER_PATH = "app/ml/models/deal_probability_scaler.pkl"
    
    @staticmethod
    def train_model(db: Session) -> None:
        """Train the deal probability model on historical data"""
        # Get all leads with outcomes
        leads = db.query(Lead).filter(Lead.deal_value > 0).all()
        
        if len(leads) < 5:
            # Not enough data, create a dummy model
            DealProbabilityService._create_dummy_model()
            return
        
        # Feature engineering
        X = []
        y = []
        
        for lead in leads:
            # Features
            num_touchpoints = len(lead.touchpoints) if lead.touchpoints else 0
            stage_to_number = {"MQL": 1, "SQL": 2, "Opportunity": 3, "Won": 4, "Lost": 0}
            stage = stage_to_number.get(lead.stage, 0)
            
            # Get campaign spend for this lead
            campaign_spend = 0.0
            if lead.touchpoints:
                for campaign_id in lead.touchpoints:
                    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
                    if campaign:
                        campaign_spend += campaign.cost
            
            # Get company industry as numerical
            industry_to_number = {"SaaS": 1, "Fintech": 2, "Healthcare": 3, "Enterprise": 4, "Other": 0}
            industry = industry_to_number.get(lead.company.industry if lead.company else "Other", 0)
            
            features = [
                num_touchpoints,
                campaign_spend,
                industry,
                stage,
                lead.deal_value / 1000 if lead.deal_value > 0 else 0  # Normalized
            ]
            
            X.append(features)
            # Target: 1 if Won, 0 if Lost
            y.append(1 if lead.stage == "Won" else 0)
        
        if len(X) > 1:
            X = np.array(X)
            y = np.array(y)
            
            # Scale features
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)
            
            # Train logistic regression
            model = LogisticRegression(random_state=42)
            model.fit(X_scaled, y)
            
            # Save model and scaler
            os.makedirs("app/ml/models", exist_ok=True)
            pickle.dump(model, open(DealProbabilityService.MODEL_PATH, "wb"))
            pickle.dump(scaler, open(DealProbabilityService.SCALER_PATH, "wb"))
    
    @staticmethod
    def _create_dummy_model() -> None:
        """Create a dummy model for testing"""
        # Create a simple model that assigns probabilities based on features
        os.makedirs("app/ml/models", exist_ok=True)
        
        # Simple model
        model = LogisticRegression(random_state=42)
        X_dummy = np.array([[1, 100, 1, 1, 10], [2, 200, 2, 2, 20]])
        y_dummy = np.array([0, 1])
        
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X_dummy)
        model.fit(X_scaled, y_dummy)
        
        pickle.dump(model, open(DealProbabilityService.MODEL_PATH, "wb"))
        pickle.dump(scaler, open(DealProbabilityService.SCALER_PATH, "wb"))
    
    @staticmethod
    def predict_probability(
        num_touchpoints: int,
        campaign_spend: float,
        industry: str,
        stage: str,
        deal_value: float,
        db: Session = None
    ) -> float:
        """Predict deal close probability for a lead"""
        try:
            # Load model and scaler
            if not os.path.exists(DealProbabilityService.MODEL_PATH):
                DealProbabilityService.train_model(db)
            
            model = pickle.load(open(DealProbabilityService.MODEL_PATH, "rb"))
            scaler = pickle.load(open(DealProbabilityService.SCALER_PATH, "rb"))
            
            # Prepare features
            industry_to_number = {"SaaS": 1, "Fintech": 2, "Healthcare": 3, "Enterprise": 4, "Other": 0}
            stage_to_number = {"MQL": 1, "SQL": 2, "Opportunity": 3, "Won": 4, "Lost": 0}
            
            features = np.array([[
                num_touchpoints,
                campaign_spend,
                industry_to_number.get(industry, 0),
                stage_to_number.get(stage, 0),
                deal_value / 1000 if deal_value > 0 else 0
            ]])
            
            # Scale and predict
            features_scaled = scaler.transform(features)
            probability = float(model.predict_proba(features_scaled)[0][1]) * 100
            
            # Clamp between 0 and 100
            return max(0, min(100, probability))
        except Exception as e:
            # Fallback simple heuristic
            base_prob = 20.0
            base_prob += num_touchpoints * 5
            base_prob += min(campaign_spend / 100, 30)
            stage_boost = {"MQL": 0, "SQL": 15, "Opportunity": 30, "Won": 100, "Lost": 0}.get(stage, 0)
            base_prob += stage_boost
            return max(0, min(100, base_prob))
    
    @staticmethod
    def get_high_probability_leads(threshold: float, db: Session) -> List[Dict]:
        """Get leads with high close probability"""
        leads = db.query(Lead).all()
        high_prob_leads = []
        
        for lead in leads:
            campaign_spend = 0.0
            if lead.touchpoints:
                for campaign_id in lead.touchpoints:
                    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
                    if campaign:
                        campaign_spend += campaign.cost
            
            prob = DealProbabilityService.predict_probability(
                len(lead.touchpoints) if lead.touchpoints else 0,
                campaign_spend,
                lead.company.industry if lead.company else "Other",
                lead.stage,
                lead.deal_value,
                db
            )
            
            if prob >= threshold:
                high_prob_leads.append({
                    "lead_id": lead.id,
                    "lead_name": lead.name,
                    "stage": lead.stage,
                    "deal_value": lead.deal_value,
                    "probability": prob,
                    "num_touchpoints": len(lead.touchpoints) if lead.touchpoints else 0
                })
        
        return sorted(high_prob_leads, key=lambda x: x["probability"], reverse=True)
