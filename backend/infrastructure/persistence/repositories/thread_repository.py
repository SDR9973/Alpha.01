from typing import List, Dict, Any

from sqlalchemy.ext.asyncio import AsyncSession
from domain.repositories.thread_repository import ThreadRepository
from infrastructure.persistence.models import Thread, Message

class SQLAlchemyThreadRepository(ThreadRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save_thread(self, thread_data: Dict[str, Any]):
        thread = Thread(**thread_data)
        self.session.add(thread)
        await self.session.commit()
        return thread

    async def save_messages(self, messages: List[Dict[str, Any]]):
        message_objects = [Message(**msg) for msg in messages]
        self.session.add_all(message_objects)
        await self.session.commit()