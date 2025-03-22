from sqlalchemy import Column, String, DateTime, UUID
from sqlalchemy.ext.declarative import declarative_base
from uuid import uuid4

Base = declarative_base()

class Thread(Base):
    __tablename__ = "threads"
    thread_id = Column(UUID, primary_key=True, default=uuid4)
    user_id = Column(String, nullable=False)
    wikipedia_title = Column(String, nullable=False)
    description = Column(String)
