from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.tool import Tool
from app.schemas.tool import ToolCreate, ToolUpdate

class ToolRepository(BaseRepository[Tool, ToolCreate, ToolUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Tool, db)
