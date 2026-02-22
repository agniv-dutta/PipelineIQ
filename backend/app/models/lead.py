from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON, func
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    source_campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True)
    email = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    touchpoints = Column(JSON, default=[])  # List of campaign touchpoints
    stage = Column(String(50), default="MQL", nullable=False)  # MQL, SQL, Opportunity, Won, Lost
    deal_value = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    company = relationship("Company", back_populates="leads")
    source_campaign = relationship("Campaign", back_populates="leads")
    attribution_results = relationship("AttributionResult", back_populates="lead", cascade="all, delete-orphan")
