from sqlalchemy import Column, String, DateTime, Integer, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

from infrastructure.persistence.database import Base


class ResearchModel(Base):
    """SQLAlchemy model for Research entity"""
    __tablename__ = "researches"

    id = Column(UUID, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    user_id = Column(UUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    message_limit = Column(Integer, nullable=True)
    file_name = Column(String, nullable=True)
    anonymized = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("UserModel", backref="researches")