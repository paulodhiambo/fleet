from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class ReminderCreate(BaseModel):
    vehicle_id: Optional[int] = None
    reminder_type: str
    title: str
    description: Optional[str] = None
    due_date: date
    status: str = "pending"
    is_recurring: bool = False
    recurrence_interval: Optional[int] = None
    recurrence_unit: Optional[str] = None


class ReminderUpdate(BaseModel):
    reminder_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    status: Optional[str] = None
    is_recurring: Optional[bool] = None
    recurrence_interval: Optional[int] = None
    recurrence_unit: Optional[str] = None
    notified: Optional[bool] = None


class ReminderResponse(BaseModel):
    id: int
    vehicle_id: Optional[int] = None
    reminder_type: str
    title: str
    description: Optional[str] = None
    due_date: date
    status: str
    is_recurring: bool
    recurrence_interval: Optional[int] = None
    recurrence_unit: Optional[str] = None
    notified: bool
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
