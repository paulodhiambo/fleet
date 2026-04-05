from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate

class ContactRepository(BaseRepository[Contact, ContactCreate, ContactUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Contact, db)
