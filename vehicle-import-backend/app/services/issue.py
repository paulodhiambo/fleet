from fastapi import Depends
from app.core.exceptions import NotFoundError
from app.services.base import BaseService
from app.repositories.issue import IssueRepository
from app.models.issue import Issue
from app.schemas.issue import IssueCreate, IssueUpdate

class IssueService(BaseService[Issue, IssueCreate, IssueUpdate, IssueRepository]):
    def __init__(self, repository: IssueRepository = Depends()):
        super().__init__(repository)
        self.not_found_exception = NotFoundError("Issue not found")
