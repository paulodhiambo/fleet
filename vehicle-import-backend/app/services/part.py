from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.part import PartRepository
from app.models.part import Part
from app.schemas.part import PartCreate, PartUpdate

class PartService(BaseService[Part, PartCreate, PartUpdate, PartRepository]):
    def __init__(self, repository: PartRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Part not found")
