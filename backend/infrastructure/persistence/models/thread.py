from sqlalchemy import Column, String, DateTime, UUID, ForeignKey
from sqlalchemy.orm import relationship
from uuid import uuid4

from infrastructure.persistence.database import Base


class Thread(Base):
    __tablename__ = "threads"

    thread_id = Column(UUID, primary_key=True, default=uuid4)
    user_id = Column(String, nullable=False)
    wikipedia_title = Column(String, nullable=False)
    description = Column(String)
    research_id = Column(UUID, ForeignKey("researches.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    messages = relationship("Message", back_populates="thread", cascade="all, delete-orphan")
    research = relationship("ResearchModel", back_populates="threads")