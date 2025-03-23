from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from application.services.wikipedia_network_service import WikipediaNetworkService
from application.dtos.network_dto import NetworkAnalysisRequestDTO, NetworkGraphDTO
from api.dependencies import get_db_session, get_current_user_id
from domain.repositories.thread_repository import ThreadRepository
from infrastructure.persistence.repositories.thread_repository import SQLAlchemyThreadRepository

router = APIRouter(prefix="/wikipedia/network", tags=["Wikipedia Analysis"])

async def get_wikipedia_network_service(
    db_session: Annotated[AsyncSession, Depends(get_db_session)]
) -> WikipediaNetworkService:
    """Dependency for Wikipedia network service"""
    thread_repository = SQLAlchemyThreadRepository(db_session)
    return WikipediaNetworkService(thread_repository)

@router.get("/{thread_id}", response_model=NetworkGraphDTO)
async def analyze_wikipedia_thread(
    thread_id: str,
    network_service: Annotated[WikipediaNetworkService, Depends(get_wikipedia_network_service)],
    current_user_id: Annotated[str, Depends(get_current_user_id)],
    start_date: Optional[str] = Query(None),
    start_time: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    end_time: Optional[str] = Query(None),
    limit: Optional[int] = Query(None),
    limit_type: str = Query("first"),
    min_length: Optional[int] = Query(None),
    max_length: Optional[int] = Query(None),
    keywords: Optional[str] = Query(None),
    min_messages: Optional[int] = Query(None),
    max_messages: Optional[int] = Query(None),
    active_users: Optional[int] = Query(None),
    selected_users: Optional[str] = Query(None),
    username: Optional[str] = Query(None),
    anonymize: bool = Query(False)
):
    """Analyze a Wikipedia thread and generate network graph"""
    try:
        # Create request DTO
        request = NetworkAnalysisRequestDTO(
            start_date=start_date,
            start_time=start_time,
            end_date=end_date,
            end_time=end_time,
            limit=limit,
            limit_type=limit_type,
            min_length=min_length,
            max_length=max_length,
            keywords=keywords,
            min_messages=min_messages,
            max_messages=max_messages,
            active_users=active_users,
            selected_users=selected_users,
            username=username,
            anonymize=anonymize
        )

        # Perform analysis
        return await network_service.analyze_wikipedia_thread(thread_id, request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )