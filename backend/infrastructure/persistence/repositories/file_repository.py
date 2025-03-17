import os
from typing import Optional, List
from datetime import datetime

from application.services.file_service import FileService
from domain.repositories.file_repository import FileRepository
from config.settings import settings


class LocalFileRepository(FileRepository, FileService):
    """Local file system implementation of file storage"""

    def __init__(self):
        super().__init__()
        # Ensure upload directory exists
        os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)

    async def save(self, content: bytes, filename: str) -> str:
        """Save file content to disk"""
        file_path = self.get_file_path(filename)

        with open(file_path, "wb") as f:
            f.write(content)

        return filename

    async def upload_file(self, file_content: bytes, filename: str) -> str:
        """Upload a file and return filename"""
        # Generate a unique filename to avoid collisions
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        unique_filename = f"{timestamp}_{filename}"

        return await self.save(file_content, unique_filename)

    async def get_content(self, filename: str) -> Optional[bytes]:
        """Get file content as bytes"""
        file_path = self.get_file_path(filename)

        if not os.path.exists(file_path):
            return None

        with open(file_path, "rb") as f:
            return f.read()

    async def get_file_content(self, filename: str) -> Optional[bytes]:
        """Get file content"""
        return await self.get_content(filename)

    async def delete(self, filename: str) -> bool:
        """Delete a file"""
        file_path = self.get_file_path(filename)

        if not os.path.exists(file_path):
            return False

        os.remove(file_path)
        return True

    async def delete_file(self, filename: str) -> bool:
        """Delete a file"""
        return await self.delete(filename)

    async def list_files(self, user_id: Optional[str] = None) -> List[str]:
        """List available files"""
        files = os.listdir(settings.UPLOAD_FOLDER)

        if user_id:
            # Filter files by user_id prefix
            return [f for f in files if f.startswith(f"{user_id}_")]

        return files

    def get_file_path(self, filename: str) -> str:
        """Get the full path to a file"""
        return os.path.join(settings.UPLOAD_FOLDER, filename)
