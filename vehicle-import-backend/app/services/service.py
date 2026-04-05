from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.service import ServiceEntryRepository
from app.models.service import ServiceEntry
from app.schemas.service import ServiceCreate, ServiceUpdate

class ServiceEntryService(BaseService[ServiceEntry, ServiceCreate, ServiceUpdate, ServiceEntryRepository]):
    def __init__(self, repository: ServiceEntryRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("ServiceEntry not found")
