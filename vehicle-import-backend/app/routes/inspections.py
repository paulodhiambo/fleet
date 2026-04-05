from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.inspection import InspectionCreate, InspectionUpdate, InspectionResponse
from app.services.inspection import InspectionService

router = APIRouter(prefix="/api/inspections", tags=["inspections"])


@router.get("/", response_model=list[InspectionResponse])
async def list_inspections(
    vehicle_id: Optional[int] = Query(None),
    inspection_type: Optional[str] = Query(None),
    service: InspectionService = Depends(),
):
    filters = {}
    if vehicle_id:
        filters["vehicle_id"] = vehicle_id
    if inspection_type:
        filters["inspection_type"] = inspection_type
    return await service.get_all(**filters)


@router.get("/{inspection_id}", response_model=InspectionResponse)
async def get_inspection(inspection_id: int, service: InspectionService = Depends()):
    return await service.get_by_id(inspection_id)


@router.post("/", response_model=InspectionResponse, status_code=201)
async def create_inspection(data: InspectionCreate, service: InspectionService = Depends()):
    return await service.create(data)


@router.put("/{inspection_id}", response_model=InspectionResponse)
async def update_inspection(inspection_id: int, data: InspectionUpdate, service: InspectionService = Depends()):
    return await service.update(inspection_id, data)


@router.delete("/{inspection_id}", status_code=204)
async def delete_inspection(inspection_id: int, service: InspectionService = Depends()):
    await service.delete(inspection_id)
