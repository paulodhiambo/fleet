from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PermissionCreate(BaseModel):
    name: str

class PermissionUpdate(BaseModel):
    name: Optional[str] = None

class PermissionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    module: str
    created_at: datetime
    model_config = {"from_attributes": True}


class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True
    permission_ids: list[int] = []


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    permission_ids: Optional[list[int]] = None


class RoleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_active: bool
    permissions: list[PermissionResponse] = []
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
