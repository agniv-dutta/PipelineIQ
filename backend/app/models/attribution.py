from sqlalchemy import Column, Integer, DateTime, Float, ForeignKey, String, func
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class AttributionResult(Base):
    __tablename__ = "attribution_results"
    
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id", ondelete="CASCADE"), nullable=False)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True)
    attribution_model = Column(String(50), nullable=False)  # linear, first_touch, last_touch, time_decay
    weighted_attribution = Column(Float, default=0.0)
    attributed_revenue = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    lead = relationship("Lead", back_populates="attribution_results")
    campaign = relationship("Campaign", back_populates="attribution_results")
