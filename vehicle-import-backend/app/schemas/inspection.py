from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class InspectionItemCreate(BaseModel):
    item_name: str
    condition: str = "pass"
    notes: Optional[str] = None


class InspectionItemResponse(BaseModel):
    id: int
    inspection_id: int
    item_name: str
    condition: str
    notes: Optional[str] = None
    model_config = {"from_attributes": True}


class InspectionCreate(BaseModel):
    vehicle_id: int
    inspection_type: str
    inspection_date: date
    inspector_name: str
    status: str = "pending"
    passed: bool = False
    notes: Optional[str] = None
    items: list[InspectionItemCreate] = []


class InspectionUpdate(BaseModel):
    inspection_type: Optional[str] = None
    inspection_date: Optional[date] = None
    inspector_name: Optional[str] = None
    status: Optional[str] = None
    passed: Optional[bool] = None
    notes: Optional[str] = None


class InspectionResponse(BaseModel):
    id: int
    vehicle_id: int
    inspection_type: str
    inspection_date: date
    inspector_name: str
    status: str
    passed: bool
    notes: Optional[str] = None
    created_at: datetime
    items: list[InspectionItemResponse] = []
    model_config = {"from_attributes": True}
