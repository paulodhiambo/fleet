from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class DocumentCreate(BaseModel):
    vehicle_id: Optional[int] = None
    title: str
    document_type: str
    file_name: Optional[str] = None
    file_url: Optional[str] = None
    expiry_date: Optional[date] = None
    status: str = "active"
    notes: Optional[str] = None


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    document_type: Optional[str] = None
    file_name: Optional[str] = None
    file_url: Optional[str] = None
    expiry_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class DocumentResponse(BaseModel):
    id: int
    vehicle_id: Optional[int] = None
    title: str
    document_type: str
    file_name: Optional[str] = None
    file_url: Optional[str] = None
    expiry_date: Optional[date] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
