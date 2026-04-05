import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

DEFAULT_DIR = "/data" if os.path.isdir("/data") else "."
DATABASE_DIR = os.environ.get("DATABASE_DIR", DEFAULT_DIR)
DATABASE_URL = f"sqlite+aiosqlite:///{DATABASE_DIR}/app.db"

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
