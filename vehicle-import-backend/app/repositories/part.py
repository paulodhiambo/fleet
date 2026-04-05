from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.part import Part
from app.schemas.part import PartCreate, PartUpdate

class PartRepository(BaseRepository[Part, PartCreate, PartUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Part, db)
