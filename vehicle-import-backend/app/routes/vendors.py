from fastapi import APIRouter, Depends, Query
from typing import Optional

from app.schemas.vendor import VendorCreate, VendorUpdate, VendorResponse
from app.services.vendor import VendorService

router = APIRouter(prefix="/api/vendors", tags=["vendors"])


@router.get("/", response_model=list[VendorResponse])
async def list_vendors(
    status: Optional[str] = Query(None),
    service: VendorService = Depends(),
):
    filters = {}
    if status:
        filters["status"] = status
    return await service.get_all(**filters)


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(vendor_id: int, service: VendorService = Depends()):
    return await service.get_by_id(vendor_id)


@router.post("/", response_model=VendorResponse, status_code=201)
async def create_vendor(data: VendorCreate, service: VendorService = Depends()):
    return await service.create(data)


@router.put("/{vendor_id}", response_model=VendorResponse)
async def update_vendor(vendor_id: int, data: VendorUpdate, service: VendorService = Depends()):
    return await service.update(vendor_id, data)


@router.delete("/{vendor_id}", status_code=204)
async def delete_vendor(vendor_id: int, service: VendorService = Depends()):
    await service.delete(vendor_id)
