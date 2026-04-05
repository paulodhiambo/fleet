from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.core.config import settings
from app.core.exceptions import setup_exception_handlers
from app.database import async_session
from app.models.role import Permission
from app.api.main import api_router


DEFAULT_PERMISSIONS = [
    ("vehicles", "view", "View vehicles"), ("vehicles", "create", "Create vehicles"),
    ("vehicles", "edit", "Edit vehicles"), ("vehicles", "delete", "Delete vehicles"),
    ("inspections", "view", "View inspections"), ("inspections", "create", "Create inspections"),
    ("inspections", "edit", "Edit inspections"), ("inspections", "delete", "Delete inspections"),
    ("issues", "view", "View issues"), ("issues", "create", "Create issues"),
    ("issues", "edit", "Edit issues"), ("issues", "delete", "Delete issues"),
    ("services", "view", "View services"), ("services", "create", "Create services"),
    ("services", "edit", "Edit services"), ("services", "delete", "Delete services"),
    ("contacts", "view", "View contacts"), ("contacts", "create", "Create contacts"),
    ("contacts", "edit", "Edit contacts"), ("contacts", "delete", "Delete contacts"),
    ("vendors", "view", "View vendors"), ("vendors", "create", "Create vendors"),
    ("vendors", "edit", "Edit vendors"), ("vendors", "delete", "Delete vendors"),
    ("parts", "view", "View parts"), ("parts", "create", "Create parts"),
    ("parts", "edit", "Edit parts"), ("parts", "delete", "Delete parts"),
    ("documents", "view", "View documents"), ("documents", "create", "Create documents"),
    ("documents", "edit", "Edit documents"), ("documents", "delete", "Delete documents"),
    ("reports", "view", "View reports"), ("reports", "export", "Export reports"),
    ("settings", "view", "View settings"), ("settings", "manage", "Manage settings"),
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Database tables are now managed by Alembic, but we still seed default permissions
    async with async_session() as session:
        result = await session.execute(select(Permission))
        existing = result.scalars().all()
        if not existing:
            for module, name, desc in DEFAULT_PERMISSIONS:
                session.add(Permission(module=module, name=name, description=desc))
            await session.commit()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FMIS backend API for the Vehicle Import Tracking System.",
    contact={
        "name": "Admin Support",
        "email": "support@example.com",
    },
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)

app.include_router(api_router)


@app.get("/healthz", tags=["health"])
async def healthz():
    return {"status": "ok", "version": settings.VERSION}
