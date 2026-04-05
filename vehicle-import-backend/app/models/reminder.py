from datetime import datetime, date
from sqlalchemy import String, Integer, Boolean, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Reminder(Base):
    __tablename__ = "reminders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    vehicle_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("vehicles.id"), nullable=True)
    reminder_type: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    is_recurring: Mapped[bool] = mapped_column(Boolean, default=False)
    recurrence_interval: Mapped[int | None] = mapped_column(Integer, nullable=True)
    recurrence_unit: Mapped[str | None] = mapped_column(String(20), nullable=True)
    notified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="reminders")
