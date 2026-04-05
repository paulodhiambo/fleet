from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.schemas.pre_inspection import PreInspectionCreate, PreInspectionUpdate, PreInspectionResponse
from app.schemas.post_inspection import PostInspectionCreate, PostInspectionUpdate, PostInspectionResponse
from app.schemas.tool import ToolCreate, ToolUpdate, ToolResponse
from app.schemas.inspection import InspectionCreate, InspectionUpdate, InspectionResponse
from app.schemas.issue import IssueCreate, IssueUpdate, IssueResponse
from app.schemas.reminder import ReminderCreate, ReminderUpdate, ReminderResponse
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from app.schemas.vendor import VendorCreate, VendorUpdate, VendorResponse
from app.schemas.part import PartCreate, PartUpdate, PartResponse
from app.schemas.place import PlaceCreate, PlaceUpdate, PlaceResponse
from app.schemas.document import DocumentCreate, DocumentUpdate, DocumentResponse

__all__ = [
    "VehicleCreate", "VehicleUpdate", "VehicleResponse",
    "PreInspectionCreate", "PreInspectionUpdate", "PreInspectionResponse",
    "PostInspectionCreate", "PostInspectionUpdate", "PostInspectionResponse",
    "ToolCreate", "ToolUpdate", "ToolResponse",
    "InspectionCreate", "InspectionUpdate", "InspectionResponse",
    "IssueCreate", "IssueUpdate", "IssueResponse",
    "ReminderCreate", "ReminderUpdate", "ReminderResponse",
    "ServiceCreate", "ServiceUpdate", "ServiceResponse",
    "ContactCreate", "ContactUpdate", "ContactResponse",
    "VendorCreate", "VendorUpdate", "VendorResponse",
    "PartCreate", "PartUpdate", "PartResponse",
    "PlaceCreate", "PlaceUpdate", "PlaceResponse",
    "DocumentCreate", "DocumentUpdate", "DocumentResponse",
]
