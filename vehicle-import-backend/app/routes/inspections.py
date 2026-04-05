from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional

from app.database import get_db
from app.models.inspection import Inspection, InspectionItem
from app.schemas.inspection import InspectionCreate, InspectionUpdate, InspectionResponse

router = APIRouter(prefix="/api/inspections", tags=["inspections"])


@router.get("/", response_model=list[InspectionResponse])
async def list_inspections(
    vehicle_id: Optional[int] = Query(None),
    inspection_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Inspection).options(selectinload(Inspection.items))
    if vehicle_id:
        query = query.where(Inspection.vehicle_id == vehicle_id)
    if inspection_type:
        query = query.where(Inspection.inspection_type == inspection_type)
    result = await db.execute(query.order_by(Inspection.created_at.desc()))
    return result.scalars().all()


@router.get("/{inspection_id}", response_model=InspectionResponse)
async def get_inspection(inspection_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Inspection).options(selectinload(Inspection.items)).where(Inspection.id == inspection_id)
    )
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return inspection


@router.post("/", response_model=InspectionResponse, status_code=201)
async def create_inspection(data: InspectionCreate, db: AsyncSession = Depends(get_db)):
    items_data = data.items
    inspection_data = data.model_dump(exclude={"items"})
    inspection = Inspection(**inspection_data)
    db.add(inspection)
    await db.flush()
    for item in items_data:
        db.add(InspectionItem(inspection_id=inspection.id, **item.model_dump()))
    await db.commit()
    result = await db.execute(
        select(Inspection).options(selectinload(Inspection.items)).where(Inspection.id == inspection.id)
    )
    return result.scalar_one()


@router.put("/{inspection_id}", response_model=InspectionResponse)
async def update_inspection(inspection_id: int, data: InspectionUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Inspection).options(selectinload(Inspection.items)).where(Inspection.id == inspection_id)
    )
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(inspection, key, value)
    await db.commit()
    await db.refresh(inspection)
    return inspection


@router.delete("/{inspection_id}", status_code=204)
async def delete_inspection(inspection_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Inspection).where(Inspection.id == inspection_id))
    inspection = result.scalar_one_or_none()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    await db.delete(inspection)
    await db.commit()
