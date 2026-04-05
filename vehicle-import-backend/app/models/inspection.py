from datetime import datetime, date
from sqlalchemy import String, Integer, Boolean, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Inspection(Base):
    __tablename__ = "inspections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    vehicle_id: Mapped[int] = mapped_column(Integer, ForeignKey("vehicles.id"), nullable=False)
    inspection_type: Mapped[str] = mapped_column(String(50), nullable=False)
    inspection_date: Mapped[date] = mapped_column(Date, nullable=False)
    inspector_name: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    passed: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="inspections")
    items = relationship("InspectionItem", back_populates="inspection", cascade="all, delete-orphan")


class InspectionItem(Base):
    __tablename__ = "inspection_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    inspection_id: Mapped[int] = mapped_column(Integer, ForeignKey("inspections.id"), nullable=False)
    item_name: Mapped[str] = mapped_column(String(200), nullable=False)
    condition: Mapped[str] = mapped_column(String(20), default="pass")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    inspection = relationship("Inspection", back_populates="items")
