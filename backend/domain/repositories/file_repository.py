from abc import ABC, abstractmethod
from typing import Optional, List


class FileRepository(ABC):
    """Repository interface for file operations"""

    @abstractmethod
    async def save(self, content: bytes, filename: str) -> str:
        """Save file and return filename"""
        pass

    @abstractmethod
    async def get_content(self, filename: str) -> Optional[bytes]:
        """Get file content"""
        pass

    @abstractmethod
    async def delete(self, filename: str) -> bool:
        """Delete file"""
        pass

    @abstractmethod
    async def list_files(self, user_id: Optional[str] = None) -> List[str]:
        """List available files"""
        pass

    @abstractmethod
    def get_file_path(self, filename: str) -> str:
        """Get full path to file"""
        pass