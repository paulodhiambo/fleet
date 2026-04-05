from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.post_inspection import PostImportInspection
from app.schemas.post_inspection import PostInspectionCreate, PostInspectionUpdate

class PostImportInspectionRepository(BaseRepository[PostImportInspection, PostInspectionCreate, PostInspectionUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(PostImportInspection, db)
