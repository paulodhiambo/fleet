from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.tool import ToolCreate, ToolUpdate, ToolResponse
from app.services.tool import ToolService

router = APIRouter(prefix="/api/tools", tags=["tools"])


@router.get("/", response_model=list[ToolResponse])
async def list_tools(
    status: Optional[str] = Query(None),
    service: ToolService = Depends(),
):
    filters = {}
    if status:
        filters["status"] = status
    return await service.get_all(**filters)


@router.get("/{tool_id}", response_model=ToolResponse)
async def get_tool(tool_id: int, service: ToolService = Depends()):
    return await service.get_by_id(tool_id)


@router.post("/", response_model=ToolResponse, status_code=201)
async def create_tool(data: ToolCreate, service: ToolService = Depends()):
    return await service.create(data)


@router.put("/{tool_id}", response_model=ToolResponse)
async def update_tool(tool_id: int, data: ToolUpdate, service: ToolService = Depends()):
    return await service.update(tool_id, data)


@router.delete("/{tool_id}", status_code=204)
async def delete_tool(tool_id: int, service: ToolService = Depends()):
    await service.delete(tool_id)
