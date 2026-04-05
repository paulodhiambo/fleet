from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.tool import Tool
from app.schemas.tool import ToolCreate, ToolUpdate, ToolResponse

router = APIRouter(prefix="/api/tools", tags=["tools"])


@router.get("/", response_model=list[ToolResponse])
async def list_tools(
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Tool)
    if status:
        query = query.where(Tool.status == status)
    result = await db.execute(query.order_by(Tool.created_at.desc()))
    return result.scalars().all()


@router.get("/{tool_id}", response_model=ToolResponse)
async def get_tool(tool_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tool).where(Tool.id == tool_id))
    tool = result.scalar_one_or_none()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    return tool


@router.post("/", response_model=ToolResponse, status_code=201)
async def create_tool(data: ToolCreate, db: AsyncSession = Depends(get_db)):
    tool = Tool(**data.model_dump())
    db.add(tool)
    await db.commit()
    await db.refresh(tool)
    return tool


@router.put("/{tool_id}", response_model=ToolResponse)
async def update_tool(tool_id: int, data: ToolUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tool).where(Tool.id == tool_id))
    tool = result.scalar_one_or_none()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(tool, key, value)
    await db.commit()
    await db.refresh(tool)
    return tool


@router.delete("/{tool_id}", status_code=204)
async def delete_tool(tool_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tool).where(Tool.id == tool_id))
    tool = result.scalar_one_or_none()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    await db.delete(tool)
    await db.commit()
