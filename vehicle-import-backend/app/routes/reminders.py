from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderResponse

router = APIRouter(prefix="/api/reminders", tags=["reminders"])


@router.get("/", response_model=list[ReminderResponse])
async def list_reminders(
    status: Optional[str] = Query(None),
    reminder_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Reminder)
    if status:
        query = query.where(Reminder.status == status)
    if reminder_type:
        query = query.where(Reminder.reminder_type == reminder_type)
    result = await db.execute(query.order_by(Reminder.due_date.asc()))
    return result.scalars().all()


@router.get("/{reminder_id}", response_model=ReminderResponse)
async def get_reminder(reminder_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reminder).where(Reminder.id == reminder_id))
    reminder = result.scalar_one_or_none()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder


@router.post("/", response_model=ReminderResponse, status_code=201)
async def create_reminder(data: ReminderCreate, db: AsyncSession = Depends(get_db)):
    reminder = Reminder(**data.model_dump())
    db.add(reminder)
    await db.commit()
    await db.refresh(reminder)
    return reminder


@router.put("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(reminder_id: int, data: ReminderUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reminder).where(Reminder.id == reminder_id))
    reminder = result.scalar_one_or_none()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(reminder, key, value)
    await db.commit()
    await db.refresh(reminder)
    return reminder


@router.delete("/{reminder_id}", status_code=204)
async def delete_reminder(reminder_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Reminder).where(Reminder.id == reminder_id))
    reminder = result.scalar_one_or_none()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    await db.delete(reminder)
    await db.commit()
