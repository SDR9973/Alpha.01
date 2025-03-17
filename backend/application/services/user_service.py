from typing import Optional, List

from pydantic import TypeAdapter

from application.dtos.user_dto import UserResponseDTO, UserUpdateDTO
from domain.repositories.user_repository import UserRepository


class UserService:
    """Application service for user operations"""

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def get_user(self, user_id: str) -> Optional[UserResponseDTO]:
        """Get user by ID"""
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            return None

        return UserResponseDTO(
            id=user.id,
            name=user.name,
            email=user.email,
            avatar=user.avatar,
            created_at=user.created_at
        )

    async def list_users(self, limit: int = 100) -> List[UserResponseDTO]:
        """List all users"""
        users = await self.user_repository.list_all(limit)
        return [
            UserResponseDTO(
                id=user.id,
                name=user.name,
                email=user.email,
                avatar=user.avatar,
                created_at=user.created_at
            )
            for user in users
        ]

    async def update_user(self, user_id: str, update_data: UserUpdateDTO) -> Optional[UserResponseDTO]:
        """Update user"""
        user_data = TypeAdapter(dict).validate_python(update_data)
        user_data = {k: v for k, v in user_data.items() if v is not None}

        updated_user = await self.user_repository.update(user_id, user_data)
        if not updated_user:
            return None

        return UserResponseDTO(
            id=updated_user.id,
            name=updated_user.name,
            email=updated_user.email,
            avatar=updated_user.avatar,
            created_at=updated_user.created_at
        )

    async def delete_user(self, user_id: str) -> bool:
        """Delete user"""
        return await self.user_repository.delete(user_id)