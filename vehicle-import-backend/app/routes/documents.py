from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentResponse

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.get("/", response_model=list[DocumentResponse])
async def list_documents(
    vehicle_id: Optional[int] = Query(None),
    document_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Document)
    if vehicle_id:
        query = query.where(Document.vehicle_id == vehicle_id)
    if document_type:
        query = query.where(Document.document_type == document_type)
    result = await db.execute(query.order_by(Document.created_at.desc()))
    return result.scalars().all()


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.post("/", response_model=DocumentResponse, status_code=201)
async def create_document(data: DocumentCreate, db: AsyncSession = Depends(get_db)):
    document = Document(**data.model_dump())
    db.add(document)
    await db.commit()
    await db.refresh(document)
    return document


@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(document_id: int, data: DocumentUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(document, key, value)
    await db.commit()
    await db.refresh(document)
    return document


@router.delete("/{document_id}", status_code=204)
async def delete_document(document_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    await db.delete(document)
    await db.commit()
