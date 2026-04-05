from fastapi import APIRouter, Depends

from app.schemas.post_inspection import PostInspectionCreate, PostInspectionUpdate, PostInspectionResponse
from app.services.post_inspection import PostImportInspectionService

router = APIRouter(prefix="/api/post-inspections", tags=["post-inspections"])


@router.get("/", response_model=list[PostInspectionResponse])
async def list_post_inspections(service: PostImportInspectionService = Depends()):
    return await service.get_all()


@router.get("/{inspection_id}", response_model=PostInspectionResponse)
async def get_post_inspection(inspection_id: int, service: PostImportInspectionService = Depends()):
    return await service.get_by_id(inspection_id)


@router.post("/", response_model=PostInspectionResponse, status_code=201)
async def create_post_inspection(data: PostInspectionCreate, service: PostImportInspectionService = Depends()):
    return await service.create(data)


@router.put("/{inspection_id}", response_model=PostInspectionResponse)
async def update_post_inspection(inspection_id: int, data: PostInspectionUpdate, service: PostImportInspectionService = Depends()):
    return await service.update(inspection_id, data)


@router.delete("/{inspection_id}", status_code=204)
async def delete_post_inspection(inspection_id: int, service: PostImportInspectionService = Depends()):
    await service.delete(inspection_id)
