"""Initialize database and seed data"""
from app.db.database import engine, SessionLocal, Base
from app.models import Company, Campaign, Lead, User, AttributionResult
from app.api.routes.seed import seed_database

def init_db():
    """Create all tables and seed data"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")
    
    # Seed data
    try:
        result = seed_database()
        print(f"✓ {result['message']}")
    except Exception as e:
        print(f"⚠ Seeding skipped: {str(e)}")

if __name__ == "__main__":
    init_db()
