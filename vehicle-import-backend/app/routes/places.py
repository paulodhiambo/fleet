from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.database import get_db
from app.models.place import Place
from app.schemas.place import PlaceCreate, PlaceUpdate, PlaceResponse

router = APIRouter(prefix="/api/places", tags=["places"])


@router.get("/", response_model=list[PlaceResponse])
async def list_places(
    place_type: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(Place)
    if place_type:
        query = query.where(Place.place_type == place_type)
    result = await db.execute(query.order_by(Place.name.asc()))
    return result.scalars().all()


@router.get("/{place_id}", response_model=PlaceResponse)
async def get_place(place_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Place).where(Place.id == place_id))
    place = result.scalar_one_or_none()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place


@router.post("/", response_model=PlaceResponse, status_code=201)
async def create_place(data: PlaceCreate, db: AsyncSession = Depends(get_db)):
    place = Place(**data.model_dump())
    db.add(place)
    await db.commit()
    await db.refresh(place)
    return place


@router.put("/{place_id}", response_model=PlaceResponse)
async def update_place(place_id: int, data: PlaceUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Place).where(Place.id == place_id))
    place = result.scalar_one_or_none()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(place, key, value)
    await db.commit()
    await db.refresh(place)
    return place


@router.delete("/{place_id}", status_code=204)
async def delete_place(place_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Place).where(Place.id == place_id))
    place = result.scalar_one_or_none()
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    await db.delete(place)
    await db.commit()
