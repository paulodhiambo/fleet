from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.pre_inspection import PreImportInspectionRepository
from app.models.pre_inspection import PreImportInspection
from app.schemas.pre_inspection import PreInspectionCreate, PreInspectionUpdate

class PreImportInspectionService(BaseService[PreImportInspection, PreInspectionCreate, PreInspectionUpdate, PreImportInspectionRepository]):
    def __init__(self, repository: PreImportInspectionRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("PreImportInspection not found")
