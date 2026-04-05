# FMIS - Vehicle Import Backend API

FMIS (Fleet Management Information System) is a production-ready REST API designed to rigorously track, manage, and process the lifecycle of imported vehicles. Built using modern Python architectures, it securely enforces a strict separation of concerns utilizing the Service-Repository pattern.

## 🚀 Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - High performance API routing & OpenAPI schema generation.
- **ORM / Database**: [SQLAlchemy 2.0 (Async)](https://www.sqlalchemy.org/) + [PostgreSQL](https://www.postgresql.org/)
- **Data Validation & Parsing**: [Pydantic v2](https://docs.pydantic.dev/) + `pydantic-settings`
- **Database Migrations**: [Alembic](https://alembic.sqlalchemy.org/)
- **Concurrency**: `asyncio` & `greenlet` for asynchronous database interactions.
- **Dependency Management**: [Poetry](https://python-poetry.org/)

## 🏗 Architecture

This application decouples protocol translation from business logic cleanly by adhering to the following structure:
- **Routes (`app/routes`)**: Thin endpoints focused strictly on HTTP abstraction (Requests parameters & responses). They do not interact with `AsyncSession` directly.
- **Services (`app/services`)**: Reusable components executing Core Domain business rules and transactions.
- **Repositories (`app/repositories`)**: Exclusively handles SQLAlchemy querying and writing to the Postgres database.
- **Global Error Handling (`app/core/exceptions.py`)**: Abstract Domain exceptions (`NotFoundError`, `ConflictError`, etc.) securely catch arbitrary faults mapping them flawlessly to universally standardized JSON outputs obfuscating raw traceback leaks.

## ⚙️ Prerequisites

1. **Python**: Version 3.10+
2. **PostgreSQL**: A running instance database (`createdb vehicle_imports`)
3. **Poetry**: Package resolver [Install Poetry](https://python-poetry.org/docs/#installation)

## 💻 Local Setup & Installation

**1. Clone the repository / Navigate to directory**
```bash
cd vehicle-import-backend
```

**2. Install dependencies**
```bash
poetry install
```

**3. Setup Environment Variables**  
Create a `.env` file reflecting the `.env.example` configurations.  
```bash
cp .env.example .env
```
Ensure your database URI points to your running instance securely:
```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/vehicle_imports
```

**4. Run Database Migrations**  
Update your database schema utilizing the Alembic configuration:
```bash
poetry run alembic upgrade head
```

**5. Seed Mock Data (Optional)**  
Populate the local instance with roles, permissions, contacts, and 5 demo vehicles representing different transport lifecycle states locally.
```bash
PYTHONPATH=. poetry run python scripts/seed_db.py
```

## 🏃 Running the Application

Initiate the development server equipped with blazing fast hot-reloading:

```bash
poetry run uvicorn app.main:app --reload --port 8000
```
*The Application will bind to `http://127.0.0.1:8000` locally.*

## 📚 API Documentation

FastAPI natively surfaces live-interactive Documentation.
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`
