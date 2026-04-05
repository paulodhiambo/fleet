from app.routes.vehicles import router as vehicles_router
from app.routes.pre_inspections import router as pre_inspections_router
from app.routes.post_inspections import router as post_inspections_router
from app.routes.tools import router as tools_router
from app.routes.inspections import router as inspections_router
from app.routes.issues import router as issues_router
from app.routes.reminders import router as reminders_router
from app.routes.services import router as services_router
from app.routes.contacts import router as contacts_router
from app.routes.vendors import router as vendors_router
from app.routes.parts import router as parts_router
from app.routes.places import router as places_router
from app.routes.documents import router as documents_router
from app.routes.reports import router as reports_router
from app.routes.roles import router as roles_router
from app.routes.permissions import router as permissions_router

__all__ = [
    "vehicles_router", "pre_inspections_router", "post_inspections_router",
    "tools_router", "inspections_router", "issues_router", "reminders_router",
    "services_router", "contacts_router", "vendors_router", "parts_router",
    "places_router", "documents_router", "reports_router",
    "roles_router", "permissions_router",
]
