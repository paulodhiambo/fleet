from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.role import Role, Permission, role_permissions
from app.schemas.role import RoleCreate, RoleUpdate, RoleResponse

router = APIRouter(prefix="/api/roles", tags=["roles"])


@router.get("/", response_model=list[RoleResponse])
async def list_roles(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).order_by(Role.name.asc()))
    return result.scalars().all()


@router.get("/{role_id}", response_model=RoleResponse)
async def get_role(role_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).where(Role.id == role_id))
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role


@router.post("/", response_model=RoleResponse, status_code=201)
async def create_role(data: RoleCreate, db: AsyncSession = Depends(get_db)):
    role = Role(name=data.name, description=data.description, is_active=data.is_active)
    if data.permission_ids:
        perms_result = await db.execute(select(Permission).where(Permission.id.in_(data.permission_ids)))
        role.permissions = list(perms_result.scalars().all())
    db.add(role)
    await db.commit()
    await db.refresh(role)
    return role


@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(role_id: int, data: RoleUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).where(Role.id == role_id))
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    if data.name is not None:
        role.name = data.name
    if data.description is not None:
        role.description = data.description
    if data.is_active is not None:
        role.is_active = data.is_active
    if data.permission_ids is not None:
        perms_result = await db.execute(select(Permission).where(Permission.id.in_(data.permission_ids)))
        role.permissions = list(perms_result.scalars().all())
    await db.commit()
    await db.refresh(role)
    return role


@router.delete("/{role_id}", status_code=204)
async def delete_role(role_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).where(Role.id == role_id))
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    await db.delete(role)
    await db.commit()
