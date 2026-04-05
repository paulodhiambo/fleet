from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.issue import Issue
from app.schemas.issue import IssueCreate, IssueUpdate

class IssueRepository(BaseRepository[Issue, IssueCreate, IssueUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Issue, db)
