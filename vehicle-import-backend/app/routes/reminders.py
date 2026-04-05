from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderResponse
from app.services.reminder import ReminderService

router = APIRouter(prefix="/api/reminders", tags=["reminders"])


@router.get("/", response_model=list[ReminderResponse])
async def list_reminders(
    status: Optional[str] = Query(None),
    reminder_type: Optional[str] = Query(None),
    service: ReminderService = Depends(),
):
    filters = {}
    if status:
        filters["status"] = status
    if reminder_type:
        filters["reminder_type"] = reminder_type
    return await service.get_all(**filters)


@router.get("/{reminder_id}", response_model=ReminderResponse)
async def get_reminder(reminder_id: int, service: ReminderService = Depends()):
    return await service.get_by_id(reminder_id)


@router.post("/", response_model=ReminderResponse, status_code=201)
async def create_reminder(data: ReminderCreate, service: ReminderService = Depends()):
    return await service.create(data)


@router.put("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(reminder_id: int, data: ReminderUpdate, service: ReminderService = Depends()):
    return await service.update(reminder_id, data)


@router.delete("/{reminder_id}", status_code=204)
async def delete_reminder(reminder_id: int, service: ReminderService = Depends()):
    await service.delete(reminder_id)
