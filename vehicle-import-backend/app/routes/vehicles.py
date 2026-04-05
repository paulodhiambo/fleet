from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.vehicle import Vehicle, MeterEntry, Expense
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


@router.get("/", response_model=list[VehicleResponse])
async def list_vehicles(
    make: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Vehicle)
    if make:
        query = query.where(Vehicle.make.ilike(f"%{make}%"))
    if status:
        query = query.where(Vehicle.status == status)
    if group:
        query = query.where(Vehicle.group == group)
    result = await db.execute(query.order_by(Vehicle.created_at.desc()))
    return result.scalars().all()


@router.get("/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(vehicle_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.post("/", response_model=VehicleResponse, status_code=201)
async def create_vehicle(data: VehicleCreate, db: AsyncSession = Depends(get_db)):
    vehicle = Vehicle(**data.model_dump())
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleResponse)
async def update_vehicle(vehicle_id: int, data: VehicleUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(vehicle, key, value)
    await db.commit()
    await db.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}", status_code=204)
async def delete_vehicle(vehicle_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.scalar_one_or_none()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    await db.delete(vehicle)
    await db.commit()


# --- Meter Entries ---

@router.get("/{vehicle_id}/meters")
async def list_meter_entries(vehicle_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MeterEntry).where(MeterEntry.vehicle_id == vehicle_id).order_by(MeterEntry.reading_date.desc())
    )
    return result.scalars().all()


@router.post("/{vehicle_id}/meters", status_code=201)
async def create_meter_entry(vehicle_id: int, reading: int, reading_date: str, notes: str = None, db: AsyncSession = Depends(get_db)):
    from datetime import date as d
    entry = MeterEntry(vehicle_id=vehicle_id, reading=reading, reading_date=d.fromisoformat(reading_date), notes=notes)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


# --- Expenses ---

@router.get("/{vehicle_id}/expenses")
async def list_expenses(vehicle_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Expense).where(Expense.vehicle_id == vehicle_id).order_by(Expense.expense_date.desc())
    )
    return result.scalars().all()


@router.post("/{vehicle_id}/expenses", status_code=201)
async def create_expense(vehicle_id: int, expense_type: str, amount: float, expense_date: str, vendor_name: str = None, notes: str = None, db: AsyncSession = Depends(get_db)):
    from datetime import date as d
    entry = Expense(vehicle_id=vehicle_id, expense_type=expense_type, amount=amount, expense_date=d.fromisoformat(expense_date), vendor_name=vendor_name, notes=notes)
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry
