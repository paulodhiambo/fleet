from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


class PostInspectionCreate(BaseModel):
    vehicle_id: int
    inspection_date: date
    inspector_name: str = Field(..., min_length=1)
    customs_clearance_passed: bool = False
    documentation_complete: bool = False
    safety_inspection_passed: bool = False
    roadworthiness_passed: bool = False
    compliance_passed: bool = False
    overall_rating: int = Field(..., ge=1, le=5)
    notes: Optional[str] = None
    passed: bool = False


class PostInspectionUpdate(BaseModel):
    inspection_date: Optional[date] = None
    inspector_name: Optional[str] = None
    customs_clearance_passed: Optional[bool] = None
    documentation_complete: Optional[bool] = None
    safety_inspection_passed: Optional[bool] = None
    roadworthiness_passed: Optional[bool] = None
    compliance_passed: Optional[bool] = None
    overall_rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None
    passed: Optional[bool] = None


class PostInspectionResponse(BaseModel):
    id: int
    vehicle_id: int
    inspection_date: date
    inspector_name: str
    customs_clearance_passed: bool
    documentation_complete: bool
    safety_inspection_passed: bool
    roadworthiness_passed: bool
    compliance_passed: bool
    overall_rating: int
    notes: Optional[str] = None
    passed: bool
    created_at: datetime
    model_config = {"from_attributes": True}
