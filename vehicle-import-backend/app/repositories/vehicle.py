from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Sequence

from app.database import get_db
from app.repositories.base import BaseRepository
from app.models.vehicle import Vehicle, MeterEntry, Expense
from app.schemas.vehicle import VehicleCreate, VehicleUpdate

class VehicleRepository(BaseRepository[Vehicle, VehicleCreate, VehicleUpdate]):
    def __init__(self, db: AsyncSession = Depends(get_db)):
        super().__init__(Vehicle, db)
        
    async def get_meter_entries(self, vehicle_id: int) -> Sequence[MeterEntry]:
        result = await self.db.execute(
            select(MeterEntry).where(MeterEntry.vehicle_id == vehicle_id).order_by(MeterEntry.reading_date.desc())
        )
        return result.scalars().all()
        
    async def create_meter_entry(self, entry: MeterEntry) -> MeterEntry:
        self.db.add(entry)
        await self.db.commit()
        await self.db.refresh(entry)
        return entry
        
    async def get_expenses(self, vehicle_id: int) -> Sequence[Expense]:
        result = await self.db.execute(
            select(Expense).where(Expense.vehicle_id == vehicle_id).order_by(Expense.expense_date.desc())
        )
        return result.scalars().all()
        
    async def create_expense(self, entry: Expense) -> Expense:
        self.db.add(entry)
        await self.db.commit()
        await self.db.refresh(entry)
        return entry
