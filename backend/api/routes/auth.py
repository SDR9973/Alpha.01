from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated

from application.services.auth_service import AuthService
from application.dtos.user_dto import UserCreateDTO, UserLoginDTO, UserResponseDTO, TokenResponseDTO
from api.dependencies import get_auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponseDTO, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreateDTO,
    auth_service: Annotated[AuthService, Depends(get_auth_service)]
):
    """Register a new user"""
    try:
        return await auth_service.register_user(user_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login", response_model=TokenResponseDTO)
async def login(
    user_data: UserLoginDTO,
    auth_service: Annotated[AuthService, Depends(get_auth_service)]
):
    """Login a user and return an access token"""
    try:
        return await auth_service.login_user(user_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )