from sqlalchemy import Column, String, DateTime, Boolean, func
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

from infrastructure.persistence.database import Base

class UserModel(Base):
    """SQLAlchemy model for User entity"""
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    password = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)