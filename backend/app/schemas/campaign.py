from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CampaignBase(BaseModel):
    name: str
    platform: str
    budget: float
    impressions: int = 0
    clicks: int = 0
    cost: float = 0.0

class CampaignCreate(CampaignBase):
    company_id: int

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    platform: Optional[str] = None
    budget: Optional[float] = None
    impressions: Optional[int] = None
    clicks: Optional[int] = None
    cost: Optional[float] = None

class Campaign(CampaignBase):
    id: int
    company_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
