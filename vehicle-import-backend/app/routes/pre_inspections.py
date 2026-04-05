from fastapi import APIRouter, Depends

from app.schemas.pre_inspection import PreInspectionCreate, PreInspectionUpdate, PreInspectionResponse
from app.services.pre_inspection import PreImportInspectionService

router = APIRouter(prefix="/api/pre-inspections", tags=["pre-inspections"])


@router.get("/", response_model=list[PreInspectionResponse])
async def list_pre_inspections(service: PreImportInspectionService = Depends()):
    return await service.get_all()


@router.get("/{inspection_id}", response_model=PreInspectionResponse)
async def get_pre_inspection(inspection_id: int, service: PreImportInspectionService = Depends()):
    return await service.get_by_id(inspection_id)


@router.post("/", response_model=PreInspectionResponse, status_code=201)
async def create_pre_inspection(data: PreInspectionCreate, service: PreImportInspectionService = Depends()):
    return await service.create(data)


@router.put("/{inspection_id}", response_model=PreInspectionResponse)
async def update_pre_inspection(inspection_id: int, data: PreInspectionUpdate, service: PreImportInspectionService = Depends()):
    return await service.update(inspection_id, data)


@router.delete("/{inspection_id}", status_code=204)
async def delete_pre_inspection(inspection_id: int, service: PreImportInspectionService = Depends()):
    await service.delete(inspection_id)
