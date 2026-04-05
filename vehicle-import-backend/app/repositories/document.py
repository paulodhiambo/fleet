from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate

class DocumentRepository(BaseRepository[Document, DocumentCreate, DocumentUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Document, db)
