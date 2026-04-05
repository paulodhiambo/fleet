from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.services.service import ServiceEntryService

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("/", response_model=list[ServiceResponse])
async def list_services(
    status: Optional[str] = Query(None),
    vehicle_id: Optional[int] = Query(None),
    service: ServiceEntryService = Depends(),
):
    filters = {}
    if status:
        filters["status"] = status
    if vehicle_id:
        filters["vehicle_id"] = vehicle_id
    return await service.get_all(**filters)


@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: int, service: ServiceEntryService = Depends()):
    return await service.get_by_id(service_id)


@router.post("/", response_model=ServiceResponse, status_code=201)
async def create_service(data: ServiceCreate, service: ServiceEntryService = Depends()):
    return await service.create(data)


@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(service_id: int, data: ServiceUpdate, service: ServiceEntryService = Depends()):
    return await service.update(service_id, data)


@router.delete("/{service_id}", status_code=204)
async def delete_service(service_id: int, service: ServiceEntryService = Depends()):
    await service.delete(service_id)
