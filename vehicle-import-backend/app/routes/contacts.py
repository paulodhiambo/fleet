from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from app.services.contact import ContactService

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


@router.get("/", response_model=list[ContactResponse])
async def list_contacts(
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    service: ContactService = Depends(),
):
    # BaseService handles filtering generically if passed as kwargs
    filters = {}
    if role:
        filters["role"] = role
    if status:
        filters["status"] = status
    # Note: If sorting order is explicitly needed (Contact.name.asc()), 
    # it can be added to the generic repo layer in the future.
    return await service.get_all(**filters)


@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(contact_id: int, service: ContactService = Depends()):
    return await service.get_by_id(contact_id)


@router.post("/", response_model=ContactResponse, status_code=201)
async def create_contact(data: ContactCreate, service: ContactService = Depends()):
    return await service.create(data)


@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(contact_id: int, data: ContactUpdate, service: ContactService = Depends()):
    return await service.update(contact_id, data)


@router.delete("/{contact_id}", status_code=204)
async def delete_contact(contact_id: int, service: ContactService = Depends()):
    await service.delete(contact_id)
