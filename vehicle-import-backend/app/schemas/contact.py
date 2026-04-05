from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ContactCreate(BaseModel):
    name: str
    role: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    address: Optional[str] = None
    status: str = "active"
    notes: Optional[str] = None


class ContactUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class ContactResponse(BaseModel):
    id: int
    name: str
    role: str
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    address: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
