from datetime import datetime
from typing import Optional

from pydantic.dataclasses import dataclass


@dataclass
class UserCreateDTO:
    """DTO for user creation"""
    name: str
    email: str
    password: str


@dataclass
class UserResponseDTO:
    """DTO for user responses"""
    id: str
    name: str
    email: str
    created_at: datetime
    avatar: Optional[str] = None


@dataclass
class UserLoginDTO:
    """DTO for user login"""
    email: str
    password: str


@dataclass
class TokenResponseDTO:
    """DTO for authentication token"""
    access_token: str
    user: UserResponseDTO
    token_type: str = "bearer"

@dataclass
class UserUpdateDTO:
    """DTO for updating user information"""
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    avatar: Optional[str] = None