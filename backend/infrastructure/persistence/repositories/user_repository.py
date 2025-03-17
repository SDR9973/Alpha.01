from typing import Optional, List

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from domain.entities.user import User
from domain.repositories.user_repository import UserRepository
from infrastructure.persistence.models.user import UserModel


class SQLAlchemyUserRepository(UserRepository):
    """SQLAlchemy implementation of UserRepository"""

    def __init__(self, session: AsyncSession):
        self.session = session

    def _model_to_entity(self, db_user: UserModel) -> User:
        """Convert UserModel to User entity"""
        return User(
            user_iid=db_user.id,
            name=db_user.name,
            email=db_user.email,
            password=db_user.password,
            avatar=db_user.avatar,
            created_at=db_user.created_at,
            is_active=db_user.is_active
        )

    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get active user by ID"""
        result = await self.session.execute(
            select(UserModel)
            .where(UserModel.id == user_id, UserModel.is_active == True)
        )
        db_user = result.scalars().first()
        return self._model_to_entity(db_user) if db_user else None

    async def get_by_email(self, email: str) -> Optional[User]:
        """Get active user by email"""
        result = await self.session.execute(
            select(UserModel)
            .where(UserModel.email == email, UserModel.is_active == True)
        )
        db_user = result.scalars().first()
        return self._model_to_entity(db_user) if db_user else None

    async def create(self, user: User) -> User:
        """Create a new user"""
        db_user = UserModel(
            name=user.name,
            email=user.email,
            password=user.password,
            avatar=user.avatar,
            is_active=user.is_active
        )

        self.session.add(db_user)
        await self.session.flush()
        await self.session.refresh(db_user)  # Load server-generated values

        return self._model_to_entity(db_user)

    async def update(self, user_id: str, user_data: dict) -> Optional[User]:
        """Update an existing user"""
        result = await self.session.execute(
            select(UserModel)
            .where(UserModel.id == user_id, UserModel.is_active == True)
        )
        db_user = result.scalars().first()

        if not db_user:
            return None

        for key, value in user_data.items():
            if hasattr(db_user, key):
                setattr(db_user, key, value)

        await self.session.flush()
        return self._model_to_entity(db_user)

    async def delete(self, user_id: str) -> bool:
        """Soft delete a user by setting is_active to False"""
        result = await self.session.execute(
            update(UserModel)
            .where(UserModel.id == user_id, UserModel.is_active == True)
            .values(is_active=False)
        )
        return result.rowcount() > 0

    async def list_all(self, limit: int = 100) -> List[User]:
        """List all active users"""
        result = await self.session.execute(
            select(UserModel)
            .where(UserModel.is_active == True)
            .limit(limit)
        )
        return [self._model_to_entity(db_user) for db_user in result.scalars()]