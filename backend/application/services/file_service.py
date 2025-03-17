from typing import Optional, List
from fastapi import UploadFile

from infrastructure.persistence.file_storage import FileStorage


class FileService:
    """Application service for file operations"""

    def __init__(self, storage_service: FileStorage):
        self.storage_service = storage_service

    async def upload_file(self, file: UploadFile, user_id: str) -> str:
        """Upload a file and return its filename"""
        content = await file.read()
        await self.storage_service.upload_file(content, file.filename, user_id)
        return file.filename
    async def get_file_content(self, filename: str) -> Optional[bytes]:
        """Get file content"""
        return await self.storage_service.get_file_content(filename)

    async def delete_file(self, filename: str) -> bool:
        """Delete a file"""
        await self.storage_service.delete_file(filename)
        return True

    async def list_files(self, user_id: Optional[str] = None) -> List[str]:
        """List all available files"""
        return await self.storage_service.list_files(user_id)
