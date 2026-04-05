from fastapi import Depends
from app.core.exceptions import NotFoundError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.services.base import BaseService
from app.repositories.inspection import InspectionRepository
from app.models.inspection import Inspection, InspectionItem
from app.schemas.inspection import InspectionCreate, InspectionUpdate

class InspectionService(BaseService[Inspection, InspectionCreate, InspectionUpdate, InspectionRepository]):
    def __init__(self, repository: InspectionRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Inspection not found")

    async def get_all(self, skip: int = 0, limit: int = 100, **filters) -> list[Inspection]:
        query = select(Inspection).options(selectinload(Inspection.items))
        for attr, value in filters.items():
            if hasattr(Inspection, attr) and value is not None:
                query = query.where(getattr(Inspection, attr) == value)
        result = await self.repository.db.execute(query.order_by(Inspection.created_at.desc()).offset(skip).limit(limit))
        return result.scalars().all()

    async def get_by_id(self, id: int) -> Inspection:
        result = await self.repository.db.execute(
            select(Inspection).options(selectinload(Inspection.items)).where(Inspection.id == id)
        )
        obj = result.scalar_one_or_none()
        if not obj:
            raise self.not_found_exception
        return obj

    async def create(self, obj_in: InspectionCreate) -> Inspection:
        items_data = obj_in.items
        inspection_data = obj_in.model_dump(exclude={"items"})
        inspection = Inspection(**inspection_data)
        self.repository.db.add(inspection)
        await self.repository.db.flush()
        
        for item in items_data:
            self.repository.db.add(InspectionItem(inspection_id=inspection.id, **item.model_dump()))
        
        await self.repository.db.commit()
        return await self.get_by_id(inspection.id)

    async def update(self, id: int, obj_in: InspectionUpdate) -> Inspection:
        inspection = await self.get_by_id(id)
        for key, value in obj_in.model_dump(exclude_unset=True).items():
            setattr(inspection, key, value)
        await self.repository.db.commit()
        await self.repository.db.refresh(inspection)
        return inspection
