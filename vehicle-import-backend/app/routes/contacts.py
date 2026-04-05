from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


@router.get("/", response_model=list[ContactResponse])
async def list_contacts(
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Contact)
    if role:
        query = query.where(Contact.role == role)
    if status:
        query = query.where(Contact.status == status)
    result = await db.execute(query.order_by(Contact.name.asc()))
    return result.scalars().all()


@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(contact_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@router.post("/", response_model=ContactResponse, status_code=201)
async def create_contact(data: ContactCreate, db: AsyncSession = Depends(get_db)):
    contact = Contact(**data.model_dump())
    db.add(contact)
    await db.commit()
    await db.refresh(contact)
    return contact


@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(contact_id: int, data: ContactUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(contact, key, value)
    await db.commit()
    await db.refresh(contact)
    return contact


@router.delete("/{contact_id}", status_code=204)
async def delete_contact(contact_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    await db.delete(contact)
    await db.commit()
