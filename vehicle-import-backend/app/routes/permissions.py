from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.role import Permission
from app.schemas.role import PermissionResponse

router = APIRouter(prefix="/api/permissions", tags=["permissions"])


@router.get("/", response_model=list[PermissionResponse])
async def list_permissions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Permission).order_by(Permission.module.asc(), Permission.name.asc()))
    return result.scalars().all()


@router.get("/{permission_id}", response_model=PermissionResponse)
async def get_permission(permission_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Permission).where(Permission.id == permission_id))
    perm = result.scalar_one_or_none()
    if not perm:
        raise HTTPException(status_code=404, detail="Permission not found")
    return perm
