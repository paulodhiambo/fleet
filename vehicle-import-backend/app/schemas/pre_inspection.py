from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


class PreInspectionCreate(BaseModel):
    vehicle_id: int
    inspection_date: date
    inspector_name: str = Field(..., min_length=1)
    engine_condition: int = Field(..., ge=1, le=5)
    body_condition: int = Field(..., ge=1, le=5)
    tire_condition: int = Field(..., ge=1, le=5)
    electrical_condition: int = Field(..., ge=1, le=5)
    emissions_passed: bool = False
    overall_rating: int = Field(..., ge=1, le=5)
    notes: Optional[str] = None
    passed: bool = False


class PreInspectionUpdate(BaseModel):
    inspection_date: Optional[date] = None
    inspector_name: Optional[str] = None
    engine_condition: Optional[int] = Field(None, ge=1, le=5)
    body_condition: Optional[int] = Field(None, ge=1, le=5)
    tire_condition: Optional[int] = Field(None, ge=1, le=5)
    electrical_condition: Optional[int] = Field(None, ge=1, le=5)
    emissions_passed: Optional[bool] = None
    overall_rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None
    passed: Optional[bool] = None


class PreInspectionResponse(BaseModel):
    id: int
    vehicle_id: int
    inspection_date: date
    inspector_name: str
    engine_condition: int
    body_condition: int
    tire_condition: int
    electrical_condition: int
    emissions_passed: bool
    overall_rating: int
    notes: Optional[str] = None
    passed: bool
    created_at: datetime
    model_config = {"from_attributes": True}
