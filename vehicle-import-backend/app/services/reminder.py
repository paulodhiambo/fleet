from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.reminder import ReminderRepository
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate

class ReminderService(BaseService[Reminder, ReminderCreate, ReminderUpdate, ReminderRepository]):
    def __init__(self, repository: ReminderRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Reminder not found")
