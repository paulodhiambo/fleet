from fastapi import APIRouter, Depends

from app.schemas.role import RoleCreate, RoleUpdate, RoleResponse
from app.services.role import RoleService

router = APIRouter(prefix="/api/roles", tags=["roles"])


@router.get("/", response_model=list[RoleResponse])
async def list_roles(service: RoleService = Depends()):
    return await service.get_all()


@router.get("/{role_id}", response_model=RoleResponse)
async def get_role(role_id: int, service: RoleService = Depends()):
    return await service.get_by_id(role_id)


@router.post("/", response_model=RoleResponse, status_code=201)
async def create_role(data: RoleCreate, service: RoleService = Depends()):
    return await service.create(data)


@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(role_id: int, data: RoleUpdate, service: RoleService = Depends()):
    return await service.update(role_id, data)


@router.delete("/{role_id}", status_code=204)
async def delete_role(role_id: int, service: RoleService = Depends()):
    await service.delete(role_id)
