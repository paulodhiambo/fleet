from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


class VehicleCreate(BaseModel):
    vin: str = Field(..., min_length=1, max_length=17)
    make: str = Field(..., min_length=1, max_length=100)
    model: str = Field(..., min_length=1, max_length=100)
    year: int = Field(..., ge=1900, le=2030)
    color: Optional[str] = None
    license_plate: Optional[str] = None
    engine_type: Optional[str] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    mileage: Optional[int] = None
    origin_country: str = Field(..., min_length=1)
    destination_country: str = "Kenya"
    purchase_price: Optional[float] = None
    purchase_date: Optional[date] = None
    owner_name: Optional[str] = None
    owner_contact: Optional[str] = None
    assigned_to: Optional[str] = None
    group: Optional[str] = None
    status: str = "pending"
    notes: Optional[str] = None


class VehicleUpdate(BaseModel):
    vin: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    color: Optional[str] = None
    license_plate: Optional[str] = None
    engine_type: Optional[str] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    mileage: Optional[int] = None
    origin_country: Optional[str] = None
    destination_country: Optional[str] = None
    purchase_price: Optional[float] = None
    purchase_date: Optional[date] = None
    owner_name: Optional[str] = None
    owner_contact: Optional[str] = None
    assigned_to: Optional[str] = None
    group: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class VehicleResponse(BaseModel):
    id: int
    vin: str
    make: str
    model: str
    year: int
    color: Optional[str] = None
    license_plate: Optional[str] = None
    engine_type: Optional[str] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    mileage: Optional[int] = None
    origin_country: str
    destination_country: str
    purchase_price: Optional[float] = None
    purchase_date: Optional[date] = None
    owner_name: Optional[str] = None
    owner_contact: Optional[str] = None
    assigned_to: Optional[str] = None
    group: Optional[str] = None
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
