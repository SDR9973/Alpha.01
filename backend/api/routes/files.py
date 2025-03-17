from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import Annotated, List

from application.services.file_service import FileService
from api.dependencies import get_file_service, get_current_user_id

router = APIRouter(prefix="/files", tags=["Files"])


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_file(
        file_service: Annotated[FileService, Depends(get_file_service)],
        current_user_id: Annotated[str, Depends(get_current_user_id)],
        file: UploadFile = File(...)

):
    """Upload a file"""
    try:
        filename = await file_service.upload_file(file, current_user_id)
        return {"message": "File uploaded successfully!", "filename": filename}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("", response_model=List[str])
async def list_files(
        file_service: Annotated[FileService, Depends(get_file_service)],
        current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """List all files for current user"""
    return await file_service.list_files(current_user_id)


@router.delete("/{filename}", status_code=status.HTTP_200_OK)
async def delete_file(
        filename: str,
        file_service: Annotated[FileService, Depends(get_file_service)],
        current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Delete a file"""
    success = await file_service.delete_file(filename)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File '{filename}' not found"
        )
    return {"message": f"File '{filename}' deleted successfully bu user {current_user_id}", "success": True}
