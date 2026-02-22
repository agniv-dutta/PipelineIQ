from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CompanyBase(BaseModel):
    name: str
    industry: str
    annual_ad_spend: float = 0.0

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    annual_ad_spend: Optional[float] = None

class Company(CompanyBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
