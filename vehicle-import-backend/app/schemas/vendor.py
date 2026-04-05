from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class VendorCreate(BaseModel):
    name: str
    vendor_type: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None
    status: str = "active"
    notes: Optional[str] = None


class VendorUpdate(BaseModel):
    name: Optional[str] = None
    vendor_type: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class VendorResponse(BaseModel):
    id: int
    name: str
    vendor_type: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    website: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
