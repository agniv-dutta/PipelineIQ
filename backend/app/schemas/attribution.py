from pydantic import BaseModel
from datetime import datetime

class AttributionResultBase(BaseModel):
    attribution_model: str
    weighted_attribution: float
    attributed_revenue: float

class AttributionResult(AttributionResultBase):
    id: int
    lead_id: int
    campaign_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
