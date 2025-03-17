import aiofiles
import aiofiles.os
import os
from pathlib import Path
import asyncio
from typing import List


class FileStorage:
    """Local filesystem-based file storage with user isolation"""

    def __init__(self, storage_root: str = "./filestorage"):
        self.storage_root = Path(storage_root)

    async def _get_user_dir(self, user_id: str) -> Path:
        """Get user-specific directory path and ensure it exists"""
        user_dir = self.storage_root / user_id
        await aiofiles.os.makedirs(user_dir, exist_ok=True)
        return user_dir

    async def upload_file(self, content: bytes, filename: str, user_id: str) -> None:
        """Store file in user-specific directory"""
        user_dir = await self._get_user_dir(user_id)
        file_path = user_dir / filename

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)

    async def get_file_content(self, filename: str) -> bytes:
        """Retrieve file content from storage root (unsafe - prefer user-specific method)"""
        file_path = self.storage_root / filename
        if not await aiofiles.os.path.exists(file_path):
            raise FileNotFoundError(f"File {filename} not found")

        async with aiofiles.open(file_path, "rb") as f:
            return await f.read()

    async def delete_file(self, filename: str) -> None:
        """Delete file from storage root (unsafe - prefer user-specific method)"""
        file_path = self.storage_root / filename
        if await aiofiles.os.path.exists(file_path):
            await aiofiles.os.remove(file_path)

    async def list_files(self, user_id: str) -> List[str]:
        """List all files in user's directory"""
        user_dir = await self._get_user_dir(user_id)

        try:
            return await asyncio.to_thread(os.listdir, user_dir)
        except FileNotFoundError:
            return []

    async def safe_delete(self, user_id: str, filename: str) -> None:
        """Safer delete operation within user directory"""
        user_dir = await self._get_user_dir(user_id)
        file_path = user_dir / filename

        if await aiofiles.os.path.exists(file_path):
            await aiofiles.os.remove(file_path)

    async def safe_get_content(self, user_id: str, filename: str) -> bytes:
        """Safer content retrieval within user directory"""
        user_dir = await self._get_user_dir(user_id)
        file_path = user_dir / filename

        if not await aiofiles.os.path.exists(file_path):
            raise FileNotFoundError(f"File {filename} not found for user {user_id}")

        async with aiofiles.open(file_path, "rb") as f:
            return await f.read()