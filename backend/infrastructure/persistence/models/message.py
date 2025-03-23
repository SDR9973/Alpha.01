from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UUID
from sqlalchemy.orm import relationship

from infrastructure.persistence.database import Base


class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True, autoincrement=True)
    thread_id = Column(UUID, ForeignKey("threads.thread_id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    sender = Column(String, nullable=False)
    content = Column(String, nullable=False)

    # Relationship
    thread = relationship("Thread", back_populates="messages")