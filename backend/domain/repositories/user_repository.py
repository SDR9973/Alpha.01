from abc import ABC, abstractmethod
from typing import Optional, List
from domain.entities.user import User


class UserRepository(ABC):
    """Repository interface for User entity"""

    @abstractmethod
    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        pass

    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        pass

    @abstractmethod
    async def create(self, user: User) -> User:
        """Create a new user"""
        pass

    @abstractmethod
    async def update(self, user_id: str, user_data: dict) -> Optional[User]:
        """Update an existing user"""
        pass

    @abstractmethod
    async def delete(self, user_id: str) -> bool:
        """Delete a user"""
        pass

    @abstractmethod
    async def list_all(self, limit: int = 100) -> List[User]:
        """List all users"""
        pass