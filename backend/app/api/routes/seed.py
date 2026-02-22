from fastapi import APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import SessionLocal
from app.models import Company as CompanyModel, Campaign as CampaignModel, Lead as LeadModel
from app.services.attribution import AttributionService
import random

router = APIRouter(prefix="/api/seed", tags=["seed"])

def seed_database():
    """Seed database with demo data"""
    db = SessionLocal()
    
    try:
        # Check if demo data already exists
        existing_company = db.query(CompanyModel).filter(CompanyModel.name == "TechFlow SaaS").first()
        if existing_company:
            return {"message": "Database already seeded"}
        
        # Create demo company
        company = CompanyModel(
            name="TechFlow SaaS",
            industry="SaaS",
            annual_ad_spend=240000.0,
        )
        db.add(company)
        db.flush()
        
        # Create campaigns
        campaigns_data = [
            ("Google Search - Growth", "Google", 50000, 500000, 25000, 15000),
            ("Google Search - Brand", "Google", 30000, 800000, 32000, 8000),
            ("LinkedIn Ads - ABM", "LinkedIn", 40000, 200000, 4000, 12000),
            ("LinkedIn Ads - Thought Leadership", "LinkedIn", 25000, 150000, 3000, 7500),
            ("Facebook - Awareness", "Meta", 20000, 1000000, 30000, 5000),
            ("Instagram - Engagement", "Meta", 15000, 800000, 24000, 3600),
            ("Google Display - Retargeting", "Google", 18000, 2000000, 80000, 5400),
            ("LinkedIn InMail - Nurture", "LinkedIn", 22000, 50000, 2000, 6600),
            ("TikTok - Brand", "Meta", 12000, 500000, 15000, 3600),
            ("YouTube - Pre-Roll", "Google", 16000, 400000, 12000, 4800),
            ("Twitter - Community", "Meta", 10000, 300000, 9000, 3000),
            ("Outbound Email - List1", "Google", 8000, 100000, 100, 2400),
        ]
        
        campaigns = []
        for name, platform, budget, impressions, clicks, cost in campaigns_data:
            campaign = CampaignModel(
                company_id=company.id,
                name=name,
                platform=platform,
                budget=budget,
                impressions=impressions,
                clicks=clicks,
                cost=cost,
            )
            db.add(campaign)
            campaigns.append(campaign)
        
        db.flush()
        
        # Create leads with realistic B2B scenarios
        lead_names = [
            "Alice Johnson", "Bob Smith", "Carol White", "David Brown", "Emma Davis",
            "Frank Wilson", "Grace Lee", "Henry Miller", "Isabel Martinez", "Jack Taylor",
            "Karen Anderson", "Liam Thomas", "Mia Jackson", "Noah Harris", "Olivia Martin",
            "Peter Thompson", "Quinn Robinson", "Rachel Clark", "Samuel Jones", "Tina Williams",
            "Uma Rodriguez", "Victor López", "Wendy Hall", "Xavier Rivera", "Yara Ahmed",
            "Zoe Green", "Aaron King", "Bella Scott", "Charles Green", "Diana Adams",
            "Ethan Nelson", "Fiona Carter", "Gideon Roberts", "Hannah Phillips", "Isaac Campbell",
            "Julia Parker", "Kevin Evans", "Laura Edwards", "Marcus Collins", "Natalia Stewart",
            "Oliver Sanchez", "Penelope Morris", "Quentin Rogers", "Rachel Reed", "Samuel Cook",
            "Tanya Morgan", "Ulysses Peterson", "Vanessa Gordon", "William Alexander", "Xenia Underwood",
            # ... more names for 300 leads
        ]
        
        # Extend lead names list
        additional_names = [
            "Sofia Hernandez", "Tyler Diaz", "Uma Reyes", "Victor Munoz", "Willow Stone",
            "Xavier Cross", "Yara Night", "Zane Walker", "Abigail Young", "Benjamin Hall",
            "Charlotte Wall", "Daniel Wells", "Eleanor West", "Ethan Wise", "Fiona Walsh",
        ]
        lead_names.extend(additional_names * 5)
        
        # Lead stages distribution
        stages = ["MQL", "SQL", "SQL", "Opportunity", "Opportunity", "Opportunity", "Won", "Won", "Won", "Lost"]
        
        for i in range(300):
            lead_name = lead_names[i % len(lead_names)]
            stage = stages[i % len(stages)]
            
            # Realistic deal values
            if stage == "Won":
                deal_value = random.choice([15000, 20000, 25000, 30000, 35000, 40000, 50000])
            elif stage == "Opportunity":
                deal_value = random.choice([10000, 15000, 20000, 25000])
            elif stage == "SQL":
                deal_value = random.choice([5000, 10000, 15000])
            else:
                deal_value = random.choice([0, 5000, 10000])
            
            # Random touchpoints (1-4 campaigns)
            num_touchpoints = random.randint(1, 4)
            touchpoints = [random.choice(range(1, len(campaigns) + 1)) for _ in range(num_touchpoints)]
            touchpoints = list(set(touchpoints))  # Remove duplicates
            
            lead = LeadModel(
                company_id=company.id,
                email=f"lead_{i}@company.com",
                name=f"{lead_name} {i}",
                stage=stage,
                deal_value=deal_value,
                touchpoints=touchpoints,
                source_campaign_id=touchpoints[0] if touchpoints else None,
            )
            db.add(lead)
        
        db.commit()
        
        # Calculate attribution for all leads using all models
        attribution_models = ["linear", "first_touch", "last_touch", "time_decay"]
        leads = db.query(LeadModel).filter(LeadModel.company_id == company.id).all()
        for lead in leads:
            if lead.touchpoints:
                for model in attribution_models:
                    result = AttributionService.calculate_attribution_for_lead(lead.id, model, db)
                    if result["results"]:
                        AttributionService.save_attribution_results(db, result["results"])
        
        return {"message": "Database seeded successfully with all attribution models", "company_id": company.id}
    
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

@router.post("/")
def trigger_seed():
    """Trigger database seeding"""
    return seed_database()
