from fastapi import Depends
from app.core.exceptions import NotFoundError
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.base import BaseService
from app.repositories.contact import ContactRepository
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate

class ContactService(BaseService[Contact, ContactCreate, ContactUpdate, ContactRepository]):
    def __init__(self, repository: ContactRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Contact not found")
