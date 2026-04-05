from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.issue import Issue
from app.schemas.issue import IssueCreate, IssueUpdate, IssueResponse

router = APIRouter(prefix="/api/issues", tags=["issues"])


@router.get("/", response_model=list[IssueResponse])
async def list_issues(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    vehicle_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Issue)
    if status:
        query = query.where(Issue.status == status)
    if priority:
        query = query.where(Issue.priority == priority)
    if vehicle_id:
        query = query.where(Issue.vehicle_id == vehicle_id)
    result = await db.execute(query.order_by(Issue.created_at.desc()))
    return result.scalars().all()


@router.get("/{issue_id}", response_model=IssueResponse)
async def get_issue(issue_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Issue).where(Issue.id == issue_id))
    issue = result.scalar_one_or_none()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue


@router.post("/", response_model=IssueResponse, status_code=201)
async def create_issue(data: IssueCreate, db: AsyncSession = Depends(get_db)):
    issue = Issue(**data.model_dump())
    db.add(issue)
    await db.commit()
    await db.refresh(issue)
    return issue


@router.put("/{issue_id}", response_model=IssueResponse)
async def update_issue(issue_id: int, data: IssueUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Issue).where(Issue.id == issue_id))
    issue = result.scalar_one_or_none()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(issue, key, value)
    await db.commit()
    await db.refresh(issue)
    return issue


@router.delete("/{issue_id}", status_code=204)
async def delete_issue(issue_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Issue).where(Issue.id == issue_id))
    issue = result.scalar_one_or_none()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    await db.delete(issue)
    await db.commit()
