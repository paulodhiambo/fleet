from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class ServiceCreate(BaseModel):
    vehicle_id: int
    service_type: str
    description: Optional[str] = None
    service_date: date
    completed_date: Optional[date] = None
    vendor_id: Optional[int] = None
    technician: Optional[str] = None
    labor_cost: Optional[float] = None
    parts_cost: Optional[float] = None
    total_cost: Optional[float] = None
    meter_reading: Optional[int] = None
    status: str = "scheduled"
    priority: str = "medium"
    notes: Optional[str] = None


class ServiceUpdate(BaseModel):
    service_type: Optional[str] = None
    description: Optional[str] = None
    service_date: Optional[date] = None
    completed_date: Optional[date] = None
    vendor_id: Optional[int] = None
    technician: Optional[str] = None
    labor_cost: Optional[float] = None
    parts_cost: Optional[float] = None
    total_cost: Optional[float] = None
    meter_reading: Optional[int] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    notes: Optional[str] = None


class ServiceResponse(BaseModel):
    id: int
    vehicle_id: int
    service_type: str
    description: Optional[str] = None
    service_date: date
    completed_date: Optional[date] = None
    vendor_id: Optional[int] = None
    technician: Optional[str] = None
    labor_cost: Optional[float] = None
    parts_cost: Optional[float] = None
    total_cost: Optional[float] = None
    meter_reading: Optional[int] = None
    status: str
    priority: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
