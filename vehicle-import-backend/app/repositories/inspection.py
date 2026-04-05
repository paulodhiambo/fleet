from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.inspection import Inspection
from app.schemas.inspection import InspectionCreate, InspectionUpdate

class InspectionRepository(BaseRepository[Inspection, InspectionCreate, InspectionUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Inspection, db)
