from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.pre_inspection import PreImportInspection
from app.schemas.pre_inspection import PreInspectionCreate, PreInspectionUpdate, PreInspectionResponse

router = APIRouter(prefix="/api/pre-inspections", tags=["pre-inspections"])


@router.get("/", response_model=list[PreInspectionResponse])
async def list_pre_inspections(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PreImportInspection).order_by(PreImportInspection.created_at.desc()))
    return result.scalars().all()


@router.get("/{inspection_id}", response_model=PreInspectionResponse)
async def get_pre_inspection(inspection_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PreImportInspection).where(PreImportInspection.id == inspection_id))
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="Pre-inspection not found")
    return inspection


@router.post("/", response_model=PreInspectionResponse, status_code=201)
async def create_pre_inspection(data: PreInspectionCreate, db: AsyncSession = Depends(get_db)):
    inspection = PreImportInspection(**data.model_dump())
    db.add(inspection)
    await db.commit()
    await db.refresh(inspection)
    return inspection


@router.put("/{inspection_id}", response_model=PreInspectionResponse)
async def update_pre_inspection(inspection_id: int, data: PreInspectionUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PreImportInspection).where(PreImportInspection.id == inspection_id))
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="Pre-inspection not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(inspection, key, value)
    await db.commit()
    await db.refresh(inspection)
    return inspection


@router.delete("/{inspection_id}", status_code=204)
async def delete_pre_inspection(inspection_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PreImportInspection).where(PreImportInspection.id == inspection_id))
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="Pre-inspection not found")
    await db.delete(inspection)
    await db.commit()
