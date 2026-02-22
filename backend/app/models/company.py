from sqlalchemy import Column, Integer, String, DateTime, Float, func
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    industry = Column(String(100), nullable=False)
    annual_ad_spend = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    campaigns = relationship("Campaign", back_populates="company", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="company", cascade="all, delete-orphan")
