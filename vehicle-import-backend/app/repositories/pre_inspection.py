from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.pre_inspection import PreImportInspection
from app.schemas.pre_inspection import PreInspectionCreate, PreInspectionUpdate

class PreImportInspectionRepository(BaseRepository[PreImportInspection, PreInspectionCreate, PreInspectionUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(PreImportInspection, db)
