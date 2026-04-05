from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.part import PartCreate, PartUpdate, PartResponse
from app.services.part import PartService

router = APIRouter(prefix="/api/parts", tags=["parts"])


@router.get("/", response_model=list[PartResponse])
async def list_parts(
    category: Optional[str] = Query(None),
    service: PartService = Depends(),
):
    filters = {}
    if category:
        filters["category"] = category
    return await service.get_all(**filters)


@router.get("/{part_id}", response_model=PartResponse)
async def get_part(part_id: int, service: PartService = Depends()):
    return await service.get_by_id(part_id)


@router.post("/", response_model=PartResponse, status_code=201)
async def create_part(data: PartCreate, service: PartService = Depends()):
    return await service.create(data)


@router.put("/{part_id}", response_model=PartResponse)
async def update_part(part_id: int, data: PartUpdate, service: PartService = Depends()):
    return await service.update(part_id, data)


@router.delete("/{part_id}", status_code=204)
async def delete_part(part_id: int, service: PartService = Depends()):
    await service.delete(part_id)
