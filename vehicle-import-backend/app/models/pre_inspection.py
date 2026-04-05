from datetime import datetime, date
from sqlalchemy import String, Integer, Boolean, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class PreImportInspection(Base):
    __tablename__ = "pre_import_inspections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    vehicle_id: Mapped[int] = mapped_column(Integer, ForeignKey("vehicles.id"), nullable=False)
    inspection_date: Mapped[date] = mapped_column(Date, nullable=False)
    inspector_name: Mapped[str] = mapped_column(String(200), nullable=False)
    engine_condition: Mapped[int] = mapped_column(Integer, nullable=False)
    body_condition: Mapped[int] = mapped_column(Integer, nullable=False)
    tire_condition: Mapped[int] = mapped_column(Integer, nullable=False)
    electrical_condition: Mapped[int] = mapped_column(Integer, nullable=False)
    emissions_passed: Mapped[bool] = mapped_column(Boolean, default=False)
    overall_rating: Mapped[int] = mapped_column(Integer, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    passed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="pre_inspections")
