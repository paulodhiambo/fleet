from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PartCreate(BaseModel):
    name: str
    part_number: Optional[str] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    quantity_in_stock: int = 0
    minimum_stock: int = 0
    unit_cost: Optional[float] = None
    location: Optional[str] = None
    compatible_vehicles: Optional[str] = None
    notes: Optional[str] = None


class PartUpdate(BaseModel):
    name: Optional[str] = None
    part_number: Optional[str] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    quantity_in_stock: Optional[int] = None
    minimum_stock: Optional[int] = None
    unit_cost: Optional[float] = None
    location: Optional[str] = None
    compatible_vehicles: Optional[str] = None
    notes: Optional[str] = None


class PartResponse(BaseModel):
    id: int
    name: str
    part_number: Optional[str] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    quantity_in_stock: int
    minimum_stock: int
    unit_cost: Optional[float] = None
    location: Optional[str] = None
    compatible_vehicles: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
