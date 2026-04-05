from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db, get_db, async_session
from app.models.role import Permission
from sqlalchemy import select
from app.routes import (
    vehicles_router, pre_inspections_router, post_inspections_router,
    tools_router, inspections_router, issues_router, reminders_router,
    services_router, contacts_router, vendors_router, parts_router,
    places_router, documents_router, reports_router,
    roles_router, permissions_router,
)


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
    await init_db()
    async with async_session() as session:
        result = await session.execute(select(Permission))
        existing = result.scalars().all()
        if not existing:
            for module, name, desc in DEFAULT_PERMISSIONS:
                session.add(Permission(module=module, name=name, description=desc))
            await session.commit()
    yield


app = FastAPI(title="Vehicle Import Tracking System", lifespan=lifespan)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(vehicles_router)
app.include_router(pre_inspections_router)
app.include_router(post_inspections_router)
app.include_router(tools_router)
app.include_router(inspections_router)
app.include_router(issues_router)
app.include_router(reminders_router)
app.include_router(services_router)
app.include_router(contacts_router)
app.include_router(vendors_router)
app.include_router(parts_router)
app.include_router(places_router)
app.include_router(documents_router)
app.include_router(reports_router)
app.include_router(roles_router)
app.include_router(permissions_router)


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
