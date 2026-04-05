from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.place import PlaceRepository
from app.models.place import Place
from app.schemas.place import PlaceCreate, PlaceUpdate

class PlaceService(BaseService[Place, PlaceCreate, PlaceUpdate, PlaceRepository]):
    def __init__(self, repository: PlaceRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Place not found")
