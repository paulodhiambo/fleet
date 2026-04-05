from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.place import Place
from app.schemas.place import PlaceCreate, PlaceUpdate

class PlaceRepository(BaseRepository[Place, PlaceCreate, PlaceUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Place, db)
