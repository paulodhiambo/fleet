from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.services.vehicle import VehicleService

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


@router.get("/", response_model=list[VehicleResponse])
async def list_vehicles(
    make: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    service: VehicleService = Depends(),
):
    filters = {}
    if make:
        filters["make"] = make # Exact match for simplicity generic proxy or customize further
    if status:
        filters["status"] = status
    if group:
        filters["group"] = group
    return await service.get_all(**filters)


@router.get("/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(vehicle_id: int, service: VehicleService = Depends()):
    return await service.get_by_id(vehicle_id)


@router.post("/", response_model=VehicleResponse, status_code=201)
async def create_vehicle(data: VehicleCreate, service: VehicleService = Depends()):
    return await service.create(data)


@router.put("/{vehicle_id}", response_model=VehicleResponse)
async def update_vehicle(vehicle_id: int, data: VehicleUpdate, service: VehicleService = Depends()):
    return await service.update(vehicle_id, data)


@router.delete("/{vehicle_id}", status_code=204)
async def delete_vehicle(vehicle_id: int, service: VehicleService = Depends()):
    await service.delete(vehicle_id)


# --- Meter Entries ---

@router.get("/{vehicle_id}/meters")
async def list_meter_entries(vehicle_id: int, service: VehicleService = Depends()):
    return await service.get_meter_entries(vehicle_id)


@router.post("/{vehicle_id}/meters", status_code=201)
async def create_meter_entry(
    vehicle_id: int, 
    reading: int, 
    reading_date: str, 
    notes: str = None, 
    service: VehicleService = Depends()
):
    return await service.create_meter_entry(vehicle_id, reading, reading_date, notes)


# --- Expenses ---

@router.get("/{vehicle_id}/expenses")
async def list_expenses(vehicle_id: int, service: VehicleService = Depends()):
    return await service.get_expenses(vehicle_id)


@router.post("/{vehicle_id}/expenses", status_code=201)
async def create_expense(
    vehicle_id: int, 
    expense_type: str, 
    amount: float, 
    expense_date: str, 
    vendor_name: str = None, 
    notes: str = None, 
    service: VehicleService = Depends()
):
    return await service.create_expense(vehicle_id, expense_type, amount, expense_date, vendor_name, notes)
