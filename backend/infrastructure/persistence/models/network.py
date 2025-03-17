from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

from infrastructure.persistence.database import Base


class NetworkAnalysisModel(Base):
    """SQLAlchemy model for NetworkAnalysis"""
    __tablename__ = "network_analyses"

    id = Column(UUID, primary_key=True, default=lambda: str(uuid4()))
    research_id = Column(UUID, ForeignKey("researches.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    node_count = Column(Integer, nullable=True)
    edge_count = Column(Integer, nullable=True)
    density = Column(Float, nullable=True)

    # Relationships
    research = relationship("ResearchModel", backref="analyses")
    nodes = relationship("NodeModel", backref="analysis", cascade="all, delete-orphan")
    links = relationship("LinkModel", backref="analysis", cascade="all, delete-orphan")


class NodeModel(Base):
    """SQLAlchemy model for Node"""
    __tablename__ = "nodes"

    id = Column(UUID, primary_key=True, default=lambda: str(uuid4()))
    node_id = Column(String, nullable=False)
    analysis_id = Column(UUID, ForeignKey("network_analyses.id", ondelete="CASCADE"), nullable=False)
    messages = Column(Integer, default=0)
    degree = Column(Float, default=0.0)
    betweenness = Column(Float, default=0.0)
    closeness = Column(Float, default=0.0)
    eigenvector = Column(Float, default=0.0)
    pagerank = Column(Float, default=0.0)


class LinkModel(Base):
    """SQLAlchemy model for Link"""
    __tablename__ = "links"

    id = Column(UUID, primary_key=True, default=lambda: str(uuid4()))
    source = Column(String, nullable=False)
    target = Column(String, nullable=False)
    weight = Column(Integer, default=1)
    analysis_id = Column(UUID, ForeignKey("network_analyses.id", ondelete="CASCADE"), nullable=False)