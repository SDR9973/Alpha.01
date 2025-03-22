from abc import ABC, abstractmethod
from typing import List, Dict, Any


class ThreadRepository(ABC):
    @abstractmethod
    async def save_thread(self, thread_data: Dict[str, Any]):
        pass

    @abstractmethod
    async def save_messages(self, messages: List[Dict[str, Any]]):
        pass 