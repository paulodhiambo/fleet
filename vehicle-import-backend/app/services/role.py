from fastapi import Depends
from app.core.exceptions import NotFoundError
from sqlalchemy import select
from app.services.base import BaseService
from app.repositories.role import RoleRepository
from app.models.role import Role, Permission
from app.schemas.role import RoleCreate, RoleUpdate

class RoleService(BaseService[Role, RoleCreate, RoleUpdate, RoleRepository]):
    def __init__(self, repository: RoleRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Role not found")

    async def create(self, obj_in: RoleCreate) -> Role:
        db_obj = Role(name=obj_in.name, description=obj_in.description, is_active=obj_in.is_active)
        if obj_in.permission_ids:
            perms_result = await self.repository.db.execute(select(Permission).where(Permission.id.in_(obj_in.permission_ids)))
            db_obj.permissions = list(perms_result.scalars().all())
        self.repository.db.add(db_obj)
        await self.repository.db.commit()
        await self.repository.db.refresh(db_obj)
        return db_obj

    async def update(self, id: int, obj_in: RoleUpdate) -> Role:
        db_obj = await self.get_by_id(id)
        if obj_in.name is not None:
            db_obj.name = obj_in.name
        if obj_in.description is not None:
            db_obj.description = obj_in.description
        if obj_in.is_active is not None:
            db_obj.is_active = obj_in.is_active
        if obj_in.permission_ids is not None:
            perms_result = await self.repository.db.execute(select(Permission).where(Permission.id.in_(obj_in.permission_ids)))
            db_obj.permissions = list(perms_result.scalars().all())
        await self.repository.db.commit()
        await self.repository.db.refresh(db_obj)
        return db_obj
