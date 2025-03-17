from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated, List

from application.services.research_service import ResearchService
from application.dtos.research_dto import ResearchCreateDTO, ResearchResponseDTO, ResearchUpdateDTO
from api.dependencies import get_research_service, get_current_user_id

router = APIRouter(prefix="/research", tags=["Research"])


@router.post("", response_model=ResearchResponseDTO, status_code=status.HTTP_201_CREATED)
async def create_research(
        data: ResearchCreateDTO,
        research_service: Annotated[ResearchService, Depends(get_research_service)],
        current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Create a new research project"""
    return await research_service.create_research(current_user_id, data)


@router.get("", response_model=List[ResearchResponseDTO])
async def get_user_researches(
        research_service: Annotated[ResearchService, Depends(get_research_service)],
        current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Get all research projects for current user"""
    return await research_service.get_user_researches(current_user_id)


@router.get("/{research_id}", response_model=ResearchResponseDTO)
async def get_research(
        research_id: str,
        research_service: Annotated[ResearchService, Depends(get_research_service)],
        current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Get a specific research project"""
    research = await research_service.get_research(research_id)

    if not research:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research not found")

    # Check ownership
    if research.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this research"
        )

    return research


@router.put("/{research_id}", response_model=ResearchResponseDTO)
async def update_research(
        research_id: str,
        data: ResearchUpdateDTO,
        research_service: Annotated[ResearchService, Depends(get_research_service)],
        current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Update a research project"""
    # First check ownership
    research = await research_service.get_research(research_id)
    if not research:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research not found")

    if research.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this research"
        )

    # Then update
    updated = await research_service.update_research(research_id, data)
    return updated


@router.delete("/{research_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_research(
        research_id: str,
        research_service: Annotated[ResearchService, Depends(get_research_service)],
        current_user_id: Annotated[str, Depends(get_current_user_id)]
):
    """Delete a research project"""
    # First check ownership
    research = await research_service.get_research(research_id)
    if not research:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Research not found")

    if research.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this research"
        )

    # Then delete
    success = await research_service.delete_research(research_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete research")