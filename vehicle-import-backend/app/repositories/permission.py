from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.role import Permission
from app.schemas.role import PermissionCreate, PermissionUpdate

class PermissionRepository(BaseRepository[Permission, PermissionCreate, PermissionUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Permission, db)
