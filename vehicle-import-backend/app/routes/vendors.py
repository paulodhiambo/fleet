from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.vendor import Vendor
from app.schemas.vendor import VendorCreate, VendorUpdate, VendorResponse

router = APIRouter(prefix="/api/vendors", tags=["vendors"])


@router.get("/", response_model=list[VendorResponse])
async def list_vendors(
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Vendor)
    if status:
        query = query.where(Vendor.status == status)
    result = await db.execute(query.order_by(Vendor.name.asc()))
    return result.scalars().all()


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(vendor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vendor).where(Vendor.id == vendor_id))
    vendor = result.scalar_one_or_none()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor


@router.post("/", response_model=VendorResponse, status_code=201)
async def create_vendor(data: VendorCreate, db: AsyncSession = Depends(get_db)):
    vendor = Vendor(**data.model_dump())
    db.add(vendor)
    await db.commit()
    await db.refresh(vendor)
    return vendor


@router.put("/{vendor_id}", response_model=VendorResponse)
async def update_vendor(vendor_id: int, data: VendorUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vendor).where(Vendor.id == vendor_id))
    vendor = result.scalar_one_or_none()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(vendor, key, value)
    await db.commit()
    await db.refresh(vendor)
    return vendor


@router.delete("/{vendor_id}", status_code=204)
async def delete_vendor(vendor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vendor).where(Vendor.id == vendor_id))
    vendor = result.scalar_one_or_none()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    await db.delete(vendor)
    await db.commit()
