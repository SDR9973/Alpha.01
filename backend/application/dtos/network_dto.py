from typing import List, Optional

from pydantic.dataclasses import dataclass


@dataclass
class NodeDTO:
    """DTO for network node"""
    id: str
    messages: int = 0
    degree: float = 0.0
    betweenness: float = 0.0
    closeness: float = 0.0
    eigenvector: float = 0.0
    pagerank: float = 0.0


@dataclass
class LinkDTO:
    """DTO for network link"""
    source: str
    target: str
    weight: int = 1


@dataclass
class NetworkGraphDTO:
    """DTO for network graph"""
    nodes: List[NodeDTO]
    links: List[LinkDTO]


@dataclass
class NetworkAnalysisRequestDTO:
    """DTO for network analysis request"""
    start_date: Optional[str] = None
    start_time: Optional[str] = None
    end_date: Optional[str] = None
    end_time: Optional[str] = None
    limit: Optional[int] = None
    limit_type: str = "first"
    min_length: Optional[int] = None
    max_length: Optional[int] = None
    keywords: Optional[str] = None
    min_messages: Optional[int] = None
    max_messages: Optional[int] = None
    active_users: Optional[int] = None
    selected_users: Optional[str] = None
    username: Optional[str] = None
    anonymize: bool = False