from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.service import ServiceEntry
from app.schemas.service import ServiceCreate, ServiceUpdate

class ServiceEntryRepository(BaseRepository[ServiceEntry, ServiceCreate, ServiceUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(ServiceEntry, db)
