from typing import Generic, TypeVar, Optional, Sequence
from pydantic import BaseModel
from sqlalchemy.orm import DeclarativeBase
from app.repositories.base import BaseRepository
from app.core.exceptions import NotFoundError

ModelType = TypeVar("ModelType", bound=DeclarativeBase)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
RepositoryType = TypeVar("RepositoryType", bound=BaseRepository)

class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType, RepositoryType]):
    def __init__(self, repository: RepositoryType):
        self.repository = repository
        self.not_found_exception = NotFoundError("Resource not found")

    async def get_all(self, **filters) -> Sequence[ModelType]:
        return await self.repository.get_all(**filters)

    async def get_by_id(self, id: int) -> ModelType:
        obj = await self.repository.get_by_id(id)
        if not obj:
            raise self.not_found_exception
        return obj

    async def create(self, obj_in: CreateSchemaType) -> ModelType:
        return await self.repository.create(obj_in)

    async def update(self, id: int, obj_in: UpdateSchemaType) -> ModelType:
        db_obj = await self.get_by_id(id)
        return await self.repository.update(db_obj, obj_in)

    async def delete(self, id: int) -> None:
        db_obj = await self.get_by_id(id)
        await self.repository.delete(db_obj)
