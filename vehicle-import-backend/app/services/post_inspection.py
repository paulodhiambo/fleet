from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.post_inspection import PostImportInspectionRepository
from app.models.post_inspection import PostImportInspection
from app.schemas.post_inspection import PostInspectionCreate, PostInspectionUpdate

class PostImportInspectionService(BaseService[PostImportInspection, PostInspectionCreate, PostInspectionUpdate, PostImportInspectionRepository]):
    def __init__(self, repository: PostImportInspectionRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("PostImportInspection not found")
