from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class LeadBase(BaseModel):
    email: EmailStr
    name: str
    stage: str = "MQL"
    deal_value: float = 0.0

class LeadCreate(LeadBase):
    company_id: int
    source_campaign_id: Optional[int] = None
    touchpoints: Optional[List[int]] = None

class LeadUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    stage: Optional[str] = None
    deal_value: Optional[float] = None
    touchpoints: Optional[List[int]] = None

class Lead(LeadBase):
    id: int
    company_id: int
    source_campaign_id: Optional[int] = None
    touchpoints: List[int] = []
    created_at: datetime
    
    class Config:
        from_attributes = True
