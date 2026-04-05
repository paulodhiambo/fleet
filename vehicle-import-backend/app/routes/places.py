from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.place import PlaceCreate, PlaceUpdate, PlaceResponse
from app.services.place import PlaceService

router = APIRouter(prefix="/api/places", tags=["places"])


@router.get("/", response_model=list[PlaceResponse])
async def list_places(
    place_type: Optional[str] = Query(None),
    service: PlaceService = Depends(),
):
    filters = {}
    if place_type:
        filters["place_type"] = place_type
    return await service.get_all(**filters)


@router.get("/{place_id}", response_model=PlaceResponse)
async def get_place(place_id: int, service: PlaceService = Depends()):
    return await service.get_by_id(place_id)


@router.post("/", response_model=PlaceResponse, status_code=201)
async def create_place(data: PlaceCreate, service: PlaceService = Depends()):
    return await service.create(data)


@router.put("/{place_id}", response_model=PlaceResponse)
async def update_place(place_id: int, data: PlaceUpdate, service: PlaceService = Depends()):
    return await service.update(place_id, data)


@router.delete("/{place_id}", status_code=204)
async def delete_place(place_id: int, service: PlaceService = Depends()):
    await service.delete(place_id)
