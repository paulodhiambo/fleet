from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class ToolCreate(BaseModel):
    name: str
    tool_type: Optional[str] = None
    serial_number: Optional[str] = None
    manufacturer: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_cost: Optional[float] = None
    assigned_to: Optional[str] = None
    location: Optional[str] = None
    status: str = "available"
    last_service_date: Optional[date] = None
    next_service_date: Optional[date] = None
    notes: Optional[str] = None


class ToolUpdate(BaseModel):
    name: Optional[str] = None
    tool_type: Optional[str] = None
    serial_number: Optional[str] = None
    manufacturer: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_cost: Optional[float] = None
    assigned_to: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    last_service_date: Optional[date] = None
    next_service_date: Optional[date] = None
    notes: Optional[str] = None


class ToolResponse(BaseModel):
    id: int
    name: str
    tool_type: Optional[str] = None
    serial_number: Optional[str] = None
    manufacturer: Optional[str] = None
    purchase_date: Optional[date] = None
    purchase_cost: Optional[float] = None
    assigned_to: Optional[str] = None
    location: Optional[str] = None
    status: str
    last_service_date: Optional[date] = None
    next_service_date: Optional[date] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
