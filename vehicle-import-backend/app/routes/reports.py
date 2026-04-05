from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models.vehicle import Vehicle
from app.models.pre_inspection import PreImportInspection
from app.models.post_inspection import PostImportInspection
from app.models.issue import Issue
from app.models.service import ServiceEntry
from app.models.reminder import Reminder

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/summary")
async def get_summary(db: AsyncSession = Depends(get_db)):
    total = await db.execute(select(func.count(Vehicle.id)))
    pending = await db.execute(select(func.count(Vehicle.id)).where(Vehicle.status == "pending"))
    pre_inspection = await db.execute(select(func.count(Vehicle.id)).where(Vehicle.status == "pre-inspection"))
    in_transit = await db.execute(select(func.count(Vehicle.id)).where(Vehicle.status == "in-transit"))
    post_inspection = await db.execute(select(func.count(Vehicle.id)).where(Vehicle.status == "post-inspection"))
    cleared = await db.execute(select(func.count(Vehicle.id)).where(Vehicle.status == "cleared"))
    rejected = await db.execute(select(func.count(Vehicle.id)).where(Vehicle.status == "rejected"))

    return {
        "total_vehicles": total.scalar() or 0,
        "pending": pending.scalar() or 0,
        "pre_inspection": pre_inspection.scalar() or 0,
        "in_transit": in_transit.scalar() or 0,
        "post_inspection": post_inspection.scalar() or 0,
        "cleared": cleared.scalar() or 0,
        "rejected": rejected.scalar() or 0,
    }


@router.get("/vehicles-by-status")
async def vehicles_by_status(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Vehicle.status, func.count(Vehicle.id)).group_by(Vehicle.status)
    )
    return [{"status": row[0], "count": row[1]} for row in result.all()]


@router.get("/vehicles-by-origin")
async def vehicles_by_origin(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Vehicle.origin_country, func.count(Vehicle.id)).group_by(Vehicle.origin_country)
    )
    return [{"country": row[0], "count": row[1]} for row in result.all()]


@router.get("/inspection-rates")
async def inspection_rates(db: AsyncSession = Depends(get_db)):
    pre_total = await db.execute(select(func.count(PreImportInspection.id)))
    pre_passed = await db.execute(select(func.count(PreImportInspection.id)).where(PreImportInspection.passed == True))
    pre_avg = await db.execute(select(func.avg(PreImportInspection.overall_rating)))

    post_total = await db.execute(select(func.count(PostImportInspection.id)))
    post_passed = await db.execute(select(func.count(PostImportInspection.id)).where(PostImportInspection.passed == True))
    post_avg = await db.execute(select(func.avg(PostImportInspection.overall_rating)))

    pt = pre_total.scalar() or 0
    pp = pre_passed.scalar() or 0
    pot = post_total.scalar() or 0
    pop = post_passed.scalar() or 0

    return {
        "pre_import": {
            "total": pt,
            "passed": pp,
            "pass_rate": round((pp / pt * 100) if pt > 0 else 0, 1),
            "average_rating": round(pre_avg.scalar() or 0, 1),
        },
        "post_import": {
            "total": pot,
            "passed": pop,
            "pass_rate": round((pop / pot * 100) if pot > 0 else 0, 1),
            "average_rating": round(post_avg.scalar() or 0, 1),
        },
    }


@router.get("/issues-summary")
async def issues_summary(db: AsyncSession = Depends(get_db)):
    total = await db.execute(select(func.count(Issue.id)))
    open_issues = await db.execute(select(func.count(Issue.id)).where(Issue.status == "open"))
    in_progress = await db.execute(select(func.count(Issue.id)).where(Issue.status == "in_progress"))
    resolved = await db.execute(select(func.count(Issue.id)).where(Issue.status == "resolved"))

    by_priority = await db.execute(
        select(Issue.priority, func.count(Issue.id)).group_by(Issue.priority)
    )

    return {
        "total": total.scalar() or 0,
        "open": open_issues.scalar() or 0,
        "in_progress": in_progress.scalar() or 0,
        "resolved": resolved.scalar() or 0,
        "by_priority": [{"priority": r[0], "count": r[1]} for r in by_priority.all()],
    }


@router.get("/service-summary")
async def service_summary(db: AsyncSession = Depends(get_db)):
    total = await db.execute(select(func.count(ServiceEntry.id)))
    scheduled = await db.execute(select(func.count(ServiceEntry.id)).where(ServiceEntry.status == "scheduled"))
    in_progress = await db.execute(select(func.count(ServiceEntry.id)).where(ServiceEntry.status == "in_progress"))
    completed = await db.execute(select(func.count(ServiceEntry.id)).where(ServiceEntry.status == "completed"))
    total_cost = await db.execute(select(func.sum(ServiceEntry.total_cost)))

    return {
        "total": total.scalar() or 0,
        "scheduled": scheduled.scalar() or 0,
        "in_progress": in_progress.scalar() or 0,
        "completed": completed.scalar() or 0,
        "total_cost": round(total_cost.scalar() or 0, 2),
    }


@router.get("/reminders-summary")
async def reminders_summary(db: AsyncSession = Depends(get_db)):
    total = await db.execute(select(func.count(Reminder.id)))
    pending = await db.execute(select(func.count(Reminder.id)).where(Reminder.status == "pending"))
    completed = await db.execute(select(func.count(Reminder.id)).where(Reminder.status == "completed"))
    overdue = await db.execute(select(func.count(Reminder.id)).where(Reminder.status == "overdue"))

    return {
        "total": total.scalar() or 0,
        "pending": pending.scalar() or 0,
        "completed": completed.scalar() or 0,
        "overdue": overdue.scalar() or 0,
    }
