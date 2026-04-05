from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate

class ReminderRepository(BaseRepository[Reminder, ReminderCreate, ReminderUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Reminder, db)
