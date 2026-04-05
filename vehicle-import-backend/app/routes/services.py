from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.service import ServiceEntry
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("/", response_model=list[ServiceResponse])
async def list_services(
    status: Optional[str] = Query(None),
    vehicle_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(ServiceEntry)
    if status:
        query = query.where(ServiceEntry.status == status)
    if vehicle_id:
        query = query.where(ServiceEntry.vehicle_id == vehicle_id)
    result = await db.execute(query.order_by(ServiceEntry.created_at.desc()))
    return result.scalars().all()


@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceEntry).where(ServiceEntry.id == service_id))
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service entry not found")
    return service


@router.post("/", response_model=ServiceResponse, status_code=201)
async def create_service(data: ServiceCreate, db: AsyncSession = Depends(get_db)):
    service = ServiceEntry(**data.model_dump())
    db.add(service)
    await db.commit()
    await db.refresh(service)
    return service


@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(service_id: int, data: ServiceUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceEntry).where(ServiceEntry.id == service_id))
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service entry not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(service, key, value)
    await db.commit()
    await db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=204)
async def delete_service(service_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceEntry).where(ServiceEntry.id == service_id))
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service entry not found")
    await db.delete(service)
    await db.commit()
