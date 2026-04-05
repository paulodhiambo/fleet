from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.permission import PermissionRepository
from app.models.role import Permission
from app.schemas.role import PermissionCreate, PermissionUpdate

class PermissionService(BaseService[Permission, PermissionCreate, PermissionUpdate, PermissionRepository]):
    def __init__(self, repository: PermissionRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Permission not found")
