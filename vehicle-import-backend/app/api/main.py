from fastapi import APIRouter

from app.routes import (
    vehicles, pre_inspections, post_inspections,
    tools, inspections, issues, reminders,
    services, contacts, vendors, parts,
    places, documents, reports,
    roles, permissions,
)

api_router = APIRouter()

api_router.include_router(vehicles.router)
api_router.include_router(pre_inspections.router)
api_router.include_router(post_inspections.router)
api_router.include_router(tools.router)
api_router.include_router(inspections.router)
api_router.include_router(issues.router)
api_router.include_router(reminders.router)
api_router.include_router(services.router)
api_router.include_router(contacts.router)
api_router.include_router(vendors.router)
api_router.include_router(parts.router)
api_router.include_router(places.router)
api_router.include_router(documents.router)
api_router.include_router(reports.router)
api_router.include_router(roles.router)
api_router.include_router(permissions.router)
