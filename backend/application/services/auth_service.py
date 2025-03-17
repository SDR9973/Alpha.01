from application.dtos.user_dto import UserCreateDTO, UserLoginDTO, UserResponseDTO, TokenResponseDTO
from domain.entities.user import User
from domain.repositories.user_repository import UserRepository
from infrastructure.security.jwt_service import JWTService
from infrastructure.security.password_service import PasswordService


class AuthService:
    """Application service for authentication"""

    def __init__(
            self,
            user_repository: UserRepository,
            password_service: PasswordService,
            jwt_service: JWTService
    ):
        self.user_repository = user_repository
        self.password_service = password_service
        self.jwt_service = jwt_service

    async def register_user(self, user_data: UserCreateDTO) -> UserResponseDTO:
        """Register a new user"""
        # Check if email already exists
        existing_user = await self.user_repository.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("Email already exists")

        # Create new user
        hashed_password = self.password_service.hash_password(user_data.password)

        new_user = User(
            name=user_data.name,
            email=user_data.email,
            password=hashed_password
        )

        created_user = await self.user_repository.create(new_user)

        return UserResponseDTO(
            id=created_user.id,
            name=created_user.name,
            email=created_user.email,
            avatar=created_user.avatar,
            created_at=created_user.created_at
        )

    async def login_user(self, credentials: UserLoginDTO) -> TokenResponseDTO:
        """Authenticate a user and generate JWT token"""
        user = await self.user_repository.get_by_email(credentials.email)

        if not user or not user.password:
            raise ValueError("Invalid email or password")

        if not self.password_service.verify_password(credentials.password, user.password):
            raise ValueError("Invalid email or password")

        # Generate JWT token
        token = self.jwt_service.create_access_token({"user_id": user.id})

        return TokenResponseDTO(
            access_token=token,
            user=UserResponseDTO(
                id=user.id,
                name=user.name,
                email=user.email,
                avatar=user.avatar or "https://cdn-icons-png.flaticon.com/512/64/64572.png",
                created_at=user.created_at
            )
        )