from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.post_inspection import PostImportInspection
from app.schemas.post_inspection import PostInspectionCreate, PostInspectionUpdate, PostInspectionResponse

router = APIRouter(prefix="/api/post-inspections", tags=["post-inspections"])


@router.get("/", response_model=list[PostInspectionResponse])
async def list_post_inspections(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PostImportInspection).order_by(PostImportInspection.created_at.desc()))
    return result.scalars().all()


@router.get("/{inspection_id}", response_model=PostInspectionResponse)
async def get_post_inspection(inspection_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PostImportInspection).where(PostImportInspection.id == inspection_id))
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="Post-inspection not found")
    return inspection


@router.post("/", response_model=PostInspectionResponse, status_code=201)
async def create_post_inspection(data: PostInspectionCreate, db: AsyncSession = Depends(get_db)):
    inspection = PostImportInspection(**data.model_dump())
    db.add(inspection)
    await db.commit()
    await db.refresh(inspection)
    return inspection


@router.put("/{inspection_id}", response_model=PostInspectionResponse)
async def update_post_inspection(inspection_id: int, data: PostInspectionUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PostImportInspection).where(PostImportInspection.id == inspection_id))
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="Post-inspection not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(inspection, key, value)
    await db.commit()
    await db.refresh(inspection)
    return inspection


@router.delete("/{inspection_id}", status_code=204)
async def delete_post_inspection(inspection_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PostImportInspection).where(PostImportInspection.id == inspection_id))
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="Post-inspection not found")
    await db.delete(inspection)
    await db.commit()
