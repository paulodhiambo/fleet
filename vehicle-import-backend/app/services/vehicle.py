from fastapi import Depends
from app.core.exceptions import NotFoundError
from typing import Sequence
from app.services.base import BaseService
from app.repositories.vehicle import VehicleRepository
from app.models.vehicle import Vehicle, MeterEntry, Expense
from app.schemas.vehicle import VehicleCreate, VehicleUpdate

class VehicleService(BaseService[Vehicle, VehicleCreate, VehicleUpdate, VehicleRepository]):
    def __init__(self, repository: VehicleRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Vehicle not found")

    async def get_meter_entries(self, vehicle_id: int) -> Sequence[MeterEntry]:
        # Validate vehicle exists
        await self.get_by_id(vehicle_id)
        return await self.repository.get_meter_entries(vehicle_id)
        
    async def create_meter_entry(self, vehicle_id: int, reading: int, reading_date: str, notes: str = None) -> MeterEntry:
        await self.get_by_id(vehicle_id)
        from datetime import date as d
        entry = MeterEntry(
            vehicle_id=vehicle_id, 
            reading=reading, 
            reading_date=d.fromisoformat(reading_date), 
            notes=notes
        )
        return await self.repository.create_meter_entry(entry)
        
    async def get_expenses(self, vehicle_id: int) -> Sequence[Expense]:
        await self.get_by_id(vehicle_id)
        return await self.repository.get_expenses(vehicle_id)
        
    async def create_expense(self, vehicle_id: int, expense_type: str, amount: float, expense_date: str, vendor_name: str = None, notes: str = None) -> Expense:
        await self.get_by_id(vehicle_id)
        from datetime import date as d
        entry = Expense(
            vehicle_id=vehicle_id, 
            expense_type=expense_type, 
            amount=amount, 
            expense_date=d.fromisoformat(expense_date), 
            vendor_name=vendor_name, 
            notes=notes
        )
        return await self.repository.create_expense(entry)
