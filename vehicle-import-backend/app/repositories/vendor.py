from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.vendor import Vendor
from app.schemas.vendor import VendorCreate, VendorUpdate

class VendorRepository(BaseRepository[Vendor, VendorCreate, VendorUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Vendor, db)
