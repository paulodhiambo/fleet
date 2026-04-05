from fastapi import APIRouter, Depends

from app.schemas.role import PermissionResponse
from app.services.permission import PermissionService

router = APIRouter(prefix="/api/permissions", tags=["permissions"])


@router.get("/", response_model=list[PermissionResponse])
async def list_permissions(service: PermissionService = Depends()):
    return await service.get_all()


@router.get("/{permission_id}", response_model=PermissionResponse)
async def get_permission(permission_id: int, service: PermissionService = Depends()):
    return await service.get_by_id(permission_id)
