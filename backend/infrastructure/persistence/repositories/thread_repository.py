from typing import List, Dict, Any, Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from domain.repositories.thread_repository import ThreadRepository
from infrastructure.persistence.models import Thread, Message


class SQLAlchemyThreadRepository(ThreadRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def save_thread(self, thread_data: Dict[str, Any]) -> Thread:
        """Save a thread to the database"""
        thread = Thread(**thread_data)
        self.session.add(thread)
        await self.session.commit()
        return thread

    async def save_messages(self, messages: List[Dict[str, Any]]) -> List[Message]:
        """Save a list of messages to the database"""
        message_objects = [Message(**msg) for msg in messages]
        self.session.add_all(message_objects)
        await self.session.commit()
        return message_objects

    async def get_thread_by_id(self, thread_id: str) -> Optional[Dict[str, Any]]:
        """Get thread by ID"""
        query = select(Thread).where(Thread.thread_id == thread_id)
        result = await self.session.execute(query)
        thread = result.scalars().first()

        if not thread:
            return None

        return {
            "thread_id": str(thread.thread_id),
            "user_id": thread.user_id,
            "wikipedia_title": thread.wikipedia_title,
            "description": thread.description
        }

    async def get_messages_by_thread_id(self, thread_id: str) -> List[Dict[str, Any]]:
        """Get all messages for a thread"""
        query = select(Message).where(Message.thread_id == thread_id).order_by(Message.timestamp)
        result = await self.session.execute(query)
        messages = result.scalars().all()

        return [
            {
                "message_id": message.message_id,
                "thread_id": str(message.thread_id),
                "timestamp": message.timestamp,
                "sender": message.sender,
                "content": message.content
            }
            for message in messages
        ]

    async def get_threads_by_user_id(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all threads created by a user"""
        query = select(Thread).where(Thread.user_id == user_id)
        result = await self.session.execute(query)
        threads = result.scalars().all()

        return [
            {
                "thread_id": str(thread.thread_id),
                "user_id": thread.user_id,
                "wikipedia_title": thread.wikipedia_title,
                "description": thread.description
            }
            for thread in threads
        ]

    async def get_threads_by_research_id(self, research_id: str) -> List[Dict[str, Any]]:
        """Get all threads associated with a research project"""
        query = select(Thread).where(Thread.research_id == research_id)
        result = await self.session.execute(query)
        threads = result.scalars().all()

        return [
            {
                "thread_id": str(thread.thread_id),
                "user_id": thread.user_id,
                "wikipedia_title": thread.wikipedia_title,
                "description": thread.description,
                "research_id": str(thread.research_id) if thread.research_id else None
            }
            for thread in threads
        ]

    async def update_thread(self, thread_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a thread"""
        query = select(Thread).where(Thread.thread_id == thread_id)
        result = await self.session.execute(query)
        thread = result.scalars().first()

        if not thread:
            return None

        for key, value in data.items():
            if hasattr(thread, key):
                setattr(thread, key, value)

        await self.session.commit()

        return {
            "thread_id": str(thread.thread_id),
            "user_id": thread.user_id,
            "wikipedia_title": thread.wikipedia_title,
            "description": thread.description,
            "research_id": str(thread.research_id) if thread.research_id else None
        }

    async def delete_thread(self, thread_id: str) -> bool:
        """Delete a thread and all its messages"""
        query = select(Thread).where(Thread.thread_id == thread_id)
        result = await self.session.execute(query)
        thread = result.scalars().first()

        if not thread:
            return False

        # Delete associated messages
        await self.session.execute(Message.__table__.delete().where(Message.thread_id == thread_id))

        # Delete thread
        await self.session.delete(thread)
        await self.session.commit()

        return True