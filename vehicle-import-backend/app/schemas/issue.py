from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class IssueCreate(BaseModel):
    vehicle_id: int
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    status: str = "open"
    reported_by: Optional[str] = None
    assigned_to: Optional[str] = None
    reported_date: date
    due_date: Optional[date] = None
    resolved_date: Optional[date] = None
    notes: Optional[str] = None


class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    reported_by: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[date] = None
    resolved_date: Optional[date] = None
    notes: Optional[str] = None


class IssueResponse(BaseModel):
    id: int
    vehicle_id: int
    title: str
    description: Optional[str] = None
    priority: str
    status: str
    reported_by: Optional[str] = None
    assigned_to: Optional[str] = None
    reported_date: date
    due_date: Optional[date] = None
    resolved_date: Optional[date] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
