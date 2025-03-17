from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from domain.repositories.user_repository import UserRepository
from domain.repositories.research_repository import ResearchRepository
from domain.repositories.file_repository import FileRepository
from application.services.auth_service import AuthService
from application.services.user_service import UserService
from application.services.research_service import ResearchService
from application.services.file_service import FileService
from application.services.network_service import NetworkService
from infrastructure.persistence.database import get_db_session
from infrastructure.persistence.file_storage import FileStorage
from infrastructure.persistence.repositories.user_repository import SQLAlchemyUserRepository
from infrastructure.persistence.repositories.research_repository import SQLAlchemyResearchRepository
from infrastructure.persistence.repositories.file_repository import LocalFileRepository
from infrastructure.security.password_service import PasswordService
from infrastructure.security.jwt_service import JWTService

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Database session dependency
DBSession = Annotated[AsyncSession, Depends(get_db_session)]

# Infrastructure services
def get_password_service() -> PasswordService:
    return PasswordService()

def get_jwt_service() -> JWTService:
    return JWTService()

# Repositories
def get_user_repository(session: DBSession) -> UserRepository:
    return SQLAlchemyUserRepository(session)

def get_research_repository(session: DBSession) -> ResearchRepository:
    return SQLAlchemyResearchRepository(session)

def get_file_repository() -> FileRepository:
    return LocalFileRepository()

# Application services
def get_auth_service(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    password_service: Annotated[PasswordService, Depends(get_password_service)],
    jwt_service: Annotated[JWTService, Depends(get_jwt_service)]
) -> AuthService:
    return AuthService(user_repository, password_service, jwt_service)

def get_user_service(
    user_repository: Annotated[UserRepository, Depends(get_user_repository)]
) -> UserService:
    return UserService(user_repository)

def get_research_service(
    research_repository: Annotated[ResearchRepository, Depends(get_research_repository)]
) -> ResearchService:
    return ResearchService(research_repository)

def get_file_service(
    file_storage: Annotated[FileStorage, Depends(get_file_repository)]
) -> FileService:
    return FileService(file_storage)

def get_network_service(
    file_repository: Annotated[FileRepository, Depends(get_file_repository)]
) -> NetworkService:
    return NetworkService(file_repository)

# Authentication dependencies
async def get_current_user_id(
    token: Annotated[str, Depends(oauth2_scheme)],
    jwt_service: Annotated[JWTService, Depends(get_jwt_service)]
) -> str:
    """Get current user ID from token"""
    try:
        payload = jwt_service.decode_token(token)
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )