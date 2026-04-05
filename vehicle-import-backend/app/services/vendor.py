from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.vendor import VendorRepository
from app.models.vendor import Vendor
from app.schemas.vendor import VendorCreate, VendorUpdate

class VendorService(BaseService[Vendor, VendorCreate, VendorUpdate, VendorRepository]):
    def __init__(self, repository: VendorRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Vendor not found")
