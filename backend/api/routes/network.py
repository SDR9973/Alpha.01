from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Annotated, Optional

from application.services.network_service import NetworkService
from application.dtos.network_dto import NetworkAnalysisRequestDTO, NetworkGraphDTO
from api.dependencies import get_network_service, get_current_user_id

router = APIRouter(prefix="/analyze/network", tags=["Network Analysis"])


@router.get("/{filename}", response_model=NetworkGraphDTO)
async def analyze_network(
        filename: str,
        network_service: Annotated[NetworkService, Depends(get_network_service)],
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
    """Analyze a chat file and generate network graph"""
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
        return await network_service.analyze_network(filename, request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}, current user: {current_user_id}"
        )