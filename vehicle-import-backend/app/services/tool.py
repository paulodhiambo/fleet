from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.tool import ToolRepository
from app.models.tool import Tool
from app.schemas.tool import ToolCreate, ToolUpdate

class ToolService(BaseService[Tool, ToolCreate, ToolUpdate, ToolRepository]):
    def __init__(self, repository: ToolRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Tool not found")
