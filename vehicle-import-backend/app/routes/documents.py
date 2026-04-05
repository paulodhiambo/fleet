from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentResponse
from app.services.document import DocumentService

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.get("/", response_model=list[DocumentResponse])
async def list_documents(
    vehicle_id: Optional[int] = Query(None),
    document_type: Optional[str] = Query(None),
    service: DocumentService = Depends(),
):
    filters = {}
    if vehicle_id:
        filters["vehicle_id"] = vehicle_id
    if document_type:
        filters["document_type"] = document_type
    return await service.get_all(**filters)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int, service: DocumentService = Depends()):
    return await service.get_by_id(document_id)


@router.post("/", response_model=DocumentResponse, status_code=201)
async def create_document(data: DocumentCreate, service: DocumentService = Depends()):
    return await service.create(data)


@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(document_id: int, data: DocumentUpdate, service: DocumentService = Depends()):
    return await service.update(document_id, data)


@router.delete("/{document_id}", status_code=204)
async def delete_document(document_id: int, service: DocumentService = Depends()):
    await service.delete(document_id)
