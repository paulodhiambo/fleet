from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.issue import IssueCreate, IssueUpdate, IssueResponse
from app.services.issue import IssueService

router = APIRouter(prefix="/api/issues", tags=["issues"])


@router.get("/", response_model=list[IssueResponse])
async def list_issues(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    vehicle_id: Optional[int] = Query(None),
    service: IssueService = Depends(),
):
    filters = {}
    if status:
        filters["status"] = status
    if priority:
        filters["priority"] = priority
    if vehicle_id:
        filters["vehicle_id"] = vehicle_id
    return await service.get_all(**filters)


@router.get("/{issue_id}", response_model=IssueResponse)
async def get_issue(issue_id: int, service: IssueService = Depends()):
    return await service.get_by_id(issue_id)


@router.post("/", response_model=IssueResponse, status_code=201)
async def create_issue(data: IssueCreate, service: IssueService = Depends()):
    return await service.create(data)


@router.put("/{issue_id}", response_model=IssueResponse)
async def update_issue(issue_id: int, data: IssueUpdate, service: IssueService = Depends()):
    return await service.update(issue_id, data)


@router.delete("/{issue_id}", status_code=204)
async def delete_issue(issue_id: int, service: IssueService = Depends()):
    await service.delete(issue_id)
