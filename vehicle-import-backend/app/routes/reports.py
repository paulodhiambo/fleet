from fastapi import APIRouter, Depends

from app.services.report import ReportService

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/summary")
async def get_summary(service: ReportService = Depends()):
    return await service.get_summary()


@router.get("/vehicles-by-status")
async def vehicles_by_status(service: ReportService = Depends()):
    return await service.get_vehicles_by_status()


@router.get("/vehicles-by-origin")
async def vehicles_by_origin(service: ReportService = Depends()):
    return await service.get_vehicles_by_origin()


@router.get("/inspection-rates")
async def inspection_rates(service: ReportService = Depends()):
    return await service.get_inspection_rates()


@router.get("/issues-summary")
async def issues_summary(service: ReportService = Depends()):
    return await service.get_issues_summary()


@router.get("/service-summary")
async def service_summary(service: ReportService = Depends()):
    return await service.get_service_summary()


@router.get("/reminders-summary")
async def reminders_summary(service: ReportService = Depends()):
    return await service.get_reminders_summary()
