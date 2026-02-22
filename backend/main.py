from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.db.database import engine, Base
from app.models import Company, Campaign, Lead, User, AttributionResult
from app.api.routes import auth, companies, campaigns, leads, attribution, analytics, seed

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
settings = get_settings()
app = FastAPI(
    title="PipelineIQ",
    description="AI-powered revenue attribution and GTM intelligence platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(campaigns.router)
app.include_router(leads.router)
app.include_router(attribution.router)
app.include_router(analytics.router)
app.include_router(seed.router)

@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Welcome to PipelineIQ API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
