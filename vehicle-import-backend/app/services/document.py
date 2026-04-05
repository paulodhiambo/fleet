from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.document import DocumentRepository
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate

class DocumentService(BaseService[Document, DocumentCreate, DocumentUpdate, DocumentRepository]):
    def __init__(self, repository: DocumentRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Document not found")
