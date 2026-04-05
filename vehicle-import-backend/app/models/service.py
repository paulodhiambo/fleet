from datetime import datetime, date
from sqlalchemy import String, Integer, Float, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ServiceEntry(Base):
    __tablename__ = "service_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    vehicle_id: Mapped[int] = mapped_column(Integer, ForeignKey("vehicles.id"), nullable=False)
    service_type: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    service_date: Mapped[date] = mapped_column(Date, nullable=False)
    completed_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    vendor_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("vendors.id"), nullable=True)
    technician: Mapped[str | None] = mapped_column(String(200), nullable=True)
    labor_cost: Mapped[float | None] = mapped_column(Float, nullable=True)
    parts_cost: Mapped[float | None] = mapped_column(Float, nullable=True)
    total_cost: Mapped[float | None] = mapped_column(Float, nullable=True)
    meter_reading: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="scheduled")
    priority: Mapped[str] = mapped_column(String(20), default="medium")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="service_entries")
    vendor = relationship("Vendor", back_populates="service_entries")
    tasks = relationship("ServiceTask", back_populates="service_entry", cascade="all, delete-orphan")


class ServiceTask(Base):
    __tablename__ = "service_tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    service_entry_id: Mapped[int] = mapped_column(Integer, ForeignKey("service_entries.id"), nullable=False)
    task_name: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    service_entry = relationship("ServiceEntry", back_populates="tasks")
