from abc import ABC, abstractmethod
from typing import Optional, List
from domain.entities.research import Research


class ResearchRepository(ABC):
    """Repository interface for Research entity"""

    @abstractmethod
    async def get_by_id(self, research_id: str) -> Optional[Research]:
        """Get research by ID"""
        pass

    @abstractmethod
    async def get_by_user_id(self, user_id: str) -> List[Research]:
        """Get research items by user ID"""
        pass

    @abstractmethod
    async def create(self, research: Research) -> Research:
        """Create a new research"""
        pass

    @abstractmethod
    async def update(self, research_id: str, research_data: dict) -> Optional[Research]:
        """Update an existing research"""
        pass

    @abstractmethod
    async def delete(self, research_id: str) -> bool:
        """Delete a research"""
        pass