from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, List

from application.services.user_service import UserService
from application.dtos.user_dto import UserResponseDTO, UserUpdateDTO
from api.dependencies import get_user_service, get_current_user_id

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponseDTO)
async def get_current_user(
        current_user_id: Annotated[str, Depends(get_current_user_id)],
        user_service: Annotated[UserService, Depends(get_user_service)]
):
    """Get current user details"""
    user = await user_service.get_user(current_user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("", response_model=List[UserResponseDTO])
async def get_users(
        user_service: Annotated[UserService, Depends(get_user_service)]
):
    """Get all users"""
    return await user_service.list_users()


@router.put("/{user_id}", response_model=UserResponseDTO)
async def update_user(
        user_id: str,
        update_data: UserUpdateDTO,
        user_service: Annotated[UserService, Depends(get_user_service)],
        current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Update user details"""
    # Only allow updating own profile
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own profile"
        )

    user = await user_service.update_user(user_id, update_data)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
        user_id: str,
        user_service: Annotated[UserService, Depends(get_user_service)],
        current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Delete a user"""
    # Only allow deleting own profile
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own profile"
        )

    success = await user_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")