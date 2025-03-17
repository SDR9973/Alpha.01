from typing import Optional, List

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from domain.entities.research import Research
from domain.repositories.research_repository import ResearchRepository
from infrastructure.persistence.models.research import ResearchModel


class SQLAlchemyResearchRepository(ResearchRepository):
    """SQLAlchemy implementation of ResearchRepository"""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, research_id: str) -> Optional[Research]:
        """Get research by ID"""
        query = select(ResearchModel).where(ResearchModel.id == research_id)
        result = await self.session.execute(query)
        db_research = result.scalars().first()

        if not db_research:
            return None

        return Research(
            research_id=db_research.id,
            name=db_research.name,
            description=db_research.description,
            user_id=db_research.user_id,
            start_date=db_research.start_date,
            end_date=db_research.end_date,
            message_limit=db_research.message_limit,
            file_name=db_research.file_name,
            anonymized=db_research.anonymized,
            created_at=db_research.created_at
        )

    async def get_by_user_id(self, user_id: str) -> List[Research]:
        """Get research items by user ID"""
        query = select(ResearchModel).where(ResearchModel.user_id == user_id)
        result = await self.session.execute(query)
        db_researches = result.scalars().all()

        return [
            Research(
                research_id=db_research.id,
                name=db_research.name,
                description=db_research.description,
                user_id=db_research.user_id,
                start_date=db_research.start_date,
                end_date=db_research.end_date,
                message_limit=db_research.message_limit,
                file_name=db_research.file_name,
                anonymized=db_research.anonymized,
                created_at=db_research.created_at
            )
            for db_research in db_researches
        ]

    async def create(self, research: Research) -> Research:
        """Create a new research"""
        db_research = ResearchModel(
            name=research.name,
            description=research.description,
            user_id=research.user_id,
            start_date=research.start_date,
            end_date=research.end_date,
            message_limit=research.message_limit,
            file_name=research.file_name,
            anonymized=research.anonymized
        )

        self.session.add(db_research)
        await self.session.flush()

        return Research(
            research_id=db_research.id,
            name=db_research.name,
            description=db_research.description,
            user_id=db_research.user_id,
            start_date=db_research.start_date,
            end_date=db_research.end_date,
            message_limit=db_research.message_limit,
            file_name=db_research.file_name,
            anonymized=db_research.anonymized,
            created_at=db_research.created_at
        )

    async def update(self, research_id: str, research_data: dict) -> Optional[Research]:
        """Update an existing research"""
        query = select(ResearchModel).where(ResearchModel.id == research_id)
        result = await self.session.execute(query)
        db_research = result.scalars().first()

        if not db_research:
            return None

        for key, value in research_data.items():
            setattr(db_research, key, value)

        await self.session.flush()

        return Research(
            research_id=db_research.id,
            name=db_research.name,
            description=db_research.description,
            user_id=db_research.user_id,
            start_date=db_research.start_date,
            end_date=db_research.end_date,
            message_limit=db_research.message_limit,
            file_name=db_research.file_name,
            anonymized=db_research.anonymized,
            created_at=db_research.created_at
        )

    async def delete(self, research_id: str) -> bool:
        """Delete a research"""
        query = delete(ResearchModel).where(ResearchModel.id == research_id)
        result = await self.session.execute(query)
        return result.rowcount() > 0