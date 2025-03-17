from datetime import datetime
from typing import Optional

from pydantic.dataclasses import dataclass


@dataclass
class ResearchCreateDTO:
    """DTO for research creation"""
    name: str
    description: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    message_limit: Optional[int] = None
    file_name: Optional[str] = None
    anonymize: bool = False


@dataclass
class ResearchResponseDTO:
    """DTO for research responses"""
    id: str
    name: str
    description: str
    user_id: str
    created_at: datetime
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    message_limit: Optional[int] = None
    file_name: Optional[str] = None
    anonymized: bool = False


@dataclass
class ResearchUpdateDTO:
    """DTO for research updates"""
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    message_limit: Optional[int] = None
    file_name: Optional[str] = None
    anonymize: Optional[bool] = None