from typing import Optional, List

from pydantic import TypeAdapter

from application.dtos.research_dto import ResearchCreateDTO, ResearchResponseDTO, ResearchUpdateDTO
from domain.entities.research import Research
from domain.repositories.research_repository import ResearchRepository


class ResearchService:
    """Application service for research operations"""

    def __init__(self, research_repository: ResearchRepository):
        self.research_repository = research_repository

    async def create_research(self, user_id: str, data: ResearchCreateDTO) -> ResearchResponseDTO:
        """Create a new research project"""
        research = Research(
            name=data.name,
            description=data.description,
            user_id=user_id,
            start_date=data.start_date,
            end_date=data.end_date,
            message_limit=data.message_limit,
            file_name=data.file_name,
            anonymized=data.anonymize
        )

        created_research = await self.research_repository.create(research)

        return ResearchResponseDTO(
            id=created_research.id,
            name=created_research.name,
            description=created_research.description,
            user_id=created_research.user_id,
            start_date=created_research.start_date,
            end_date=created_research.end_date,
            message_limit=created_research.message_limit,
            file_name=created_research.file_name,
            anonymized=created_research.anonymized,
            created_at=created_research.created_at
        )

    async def get_research(self, research_id: str) -> Optional[ResearchResponseDTO]:
        """Get research by ID"""
        research = await self.research_repository.get_by_id(research_id)
        if not research:
            return None

        return ResearchResponseDTO(
            id=research.id,
            name=research.name,
            description=research.description,
            user_id=research.user_id,
            start_date=research.start_date,
            end_date=research.end_date,
            message_limit=research.message_limit,
            file_name=research.file_name,
            anonymized=research.anonymized,
            created_at=research.created_at
        )

    async def get_user_researches(self, user_id: str) -> List[ResearchResponseDTO]:
        """Get all researches for a user"""
        researches = await self.research_repository.get_by_user_id(user_id)

        return [
            ResearchResponseDTO(
                id=research.id,
                name=research.name,
                description=research.description,
                user_id=research.user_id,
                start_date=research.start_date,
                end_date=research.end_date,
                message_limit=research.message_limit,
                file_name=research.file_name,
                anonymized=research.anonymized,
                created_at=research.created_at
            )
            for research in researches
        ]

    async def update_research(self, research_id: str, data: ResearchUpdateDTO) -> Optional[ResearchResponseDTO]:
        """Update a research"""
        update_data = TypeAdapter(dict).validate_python(data)
        update_data = {k: v for k, v in update_data.items() if v is not None}

        updated_research = await self.research_repository.update(research_id, update_data)
        if not updated_research:
            return None

        return ResearchResponseDTO(
            id=updated_research.id,
            name=updated_research.name,
            description=updated_research.description,
            user_id=updated_research.user_id,
            start_date=updated_research.start_date,
            end_date=updated_research.end_date,
            message_limit=updated_research.message_limit,
            file_name=updated_research.file_name,
            anonymized=updated_research.anonymized,
            created_at=updated_research.created_at
        )

    async def delete_research(self, research_id: str) -> bool:
        """Delete a research"""
        return await self.research_repository.delete(research_id)