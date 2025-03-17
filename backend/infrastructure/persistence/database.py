from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, AsyncEngine
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import AsyncGenerator

from config.settings import settings

# Create base model class
Base = declarative_base()

# Create async engine
engine: AsyncEngine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,
    future=True
)

# Create async session factory
async_session_factory = sessionmaker(
    engine=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Get database session"""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise