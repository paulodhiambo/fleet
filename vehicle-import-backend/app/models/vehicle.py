from datetime import datetime, date
from sqlalchemy import String, Integer, Float, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    vin: Mapped[str] = mapped_column(String(17), unique=True, nullable=False)
    make: Mapped[str] = mapped_column(String(100), nullable=False)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    color: Mapped[str | None] = mapped_column(String(50), nullable=True)
    license_plate: Mapped[str | None] = mapped_column(String(20), nullable=True)
    engine_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    fuel_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    transmission: Mapped[str | None] = mapped_column(String(50), nullable=True)
    mileage: Mapped[int | None] = mapped_column(Integer, nullable=True)
    origin_country: Mapped[str] = mapped_column(String(100), nullable=False)
    destination_country: Mapped[str] = mapped_column(String(100), default="Kenya")
    purchase_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    purchase_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    owner_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    owner_contact: Mapped[str | None] = mapped_column(String(200), nullable=True)
    assigned_to: Mapped[str | None] = mapped_column(String(200), nullable=True)
    group: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    pre_inspections = relationship("PreImportInspection", back_populates="vehicle", cascade="all, delete-orphan")
    post_inspections = relationship("PostImportInspection", back_populates="vehicle", cascade="all, delete-orphan")
    inspections = relationship("Inspection", back_populates="vehicle", cascade="all, delete-orphan")
    issues = relationship("Issue", back_populates="vehicle", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="vehicle", cascade="all, delete-orphan")
    service_entries = relationship("ServiceEntry", back_populates="vehicle", cascade="all, delete-orphan")
    meter_entries = relationship("MeterEntry", back_populates="vehicle", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="vehicle", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="vehicle", cascade="all, delete-orphan")


class MeterEntry(Base):
    __tablename__ = "meter_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    vehicle_id: Mapped[int] = mapped_column(Integer, ForeignKey("vehicles.id"), nullable=False)
    reading: Mapped[int] = mapped_column(Integer, nullable=False)
    reading_date: Mapped[date] = mapped_column(Date, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="meter_entries")


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    vehicle_id: Mapped[int] = mapped_column(Integer, ForeignKey("vehicles.id"), nullable=False)
    expense_type: Mapped[str] = mapped_column(String(50), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    expense_date: Mapped[date] = mapped_column(Date, nullable=False)
    vendor_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="expenses")
