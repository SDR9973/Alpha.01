from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class ThreadRepository(ABC):
    """Repository interface for thread data management"""

    @abstractmethod
    async def save_thread(self, thread_data: Dict[str, Any]) -> None:
        """Save a thread to the database"""
        pass

    @abstractmethod
    async def save_messages(self, messages: List[Dict[str, Any]]) -> None:
        """Save messages to the database"""
        pass

    @abstractmethod
    async def get_thread_by_id(self, thread_id: str) -> Optional[Dict[str, Any]]:
        """Get thread by ID"""
        pass

    @abstractmethod
    async def get_messages_by_thread_id(self, thread_id: str) -> List[Dict[str, Any]]:
        """Get all messages for a thread"""
        pass

    @abstractmethod
    async def get_threads_by_user_id(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all threads created by a user"""
        pass

    @abstractmethod
    async def get_threads_by_research_id(self, research_id: str) -> List[Dict[str, Any]]:
        """Get all threads associated with a research project"""
        pass

    @abstractmethod
    async def count_messages_by_thread_id(self, thread_id: str) -> int:
        """Count messages in a thread"""
        pass