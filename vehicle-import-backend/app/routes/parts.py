from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.part import Part
from app.schemas.part import PartCreate, PartUpdate, PartResponse

router = APIRouter(prefix="/api/parts", tags=["parts"])


@router.get("/", response_model=list[PartResponse])
async def list_parts(
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Part)
    if category:
        query = query.where(Part.category == category)
    result = await db.execute(query.order_by(Part.name.asc()))
    return result.scalars().all()


@router.get("/{part_id}", response_model=PartResponse)
async def get_part(part_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Part).where(Part.id == part_id))
    part = result.scalar_one_or_none()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    return part


@router.post("/", response_model=PartResponse, status_code=201)
async def create_part(data: PartCreate, db: AsyncSession = Depends(get_db)):
    part = Part(**data.model_dump())
    db.add(part)
    await db.commit()
    await db.refresh(part)
    return part


@router.put("/{part_id}", response_model=PartResponse)
async def update_part(part_id: int, data: PartUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Part).where(Part.id == part_id))
    part = result.scalar_one_or_none()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(part, key, value)
    await db.commit()
    await db.refresh(part)
    return part


@router.delete("/{part_id}", status_code=204)
async def delete_part(part_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Part).where(Part.id == part_id))
    part = result.scalar_one_or_none()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    await db.delete(part)
    await db.commit()
