from fastapi import APIRouter, Depends, HTTPException, Path, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from api.dependencies import get_db_session, get_current_user_id
from integration.wiki import search_wikipedia
from integration.wiki.services import upload_wikipedia_thread, get_wikipedia_talk_page, get_wikipedia_page
from infrastructure.persistence.repositories.thread_repository import SQLAlchemyThreadRepository

router = APIRouter(prefix="/wikipedia", tags=["Wikipedia"])


class ThreadUploadRequest(BaseModel):
    wikipedia_title: str
    description: str = ""
    research_id: Optional[str] = None


class ThreadResponse(BaseModel):
    thread_id: str
    wikipedia_title: str
    description: str
    user_id: str
    research_id: Optional[str] = None


class MessageResponse(BaseModel):
    message_id: int
    thread_id: str
    timestamp: str
    sender: str
    content: str


@router.get("/search")
async def search_endpoint(query: str, limit: int = 10):
    """Search Wikipedia for pages matching query"""
    try:
        results = await search_wikipedia(query, limit)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/page/{title}")
async def page_endpoint(title: str):
    """Get content of a Wikipedia page"""
    try:
        page = await get_wikipedia_page(title)
        return page
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/talk/{title}")
async def talk_page_endpoint(title: str):
    """Get content of a Wikipedia talk page"""
    try:
        talk_page = await get_wikipedia_talk_page(title)
        return talk_page
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload-threaded", response_model=Dict[str, Any])
async def upload_thread_endpoint(
        request: ThreadUploadRequest,
        current_user_id: str = Depends(get_current_user_id),
        db_session: AsyncSession = Depends(get_db_session)
):
    """Upload a Wikipedia thread for analysis"""
    try:
        data = await upload_wikipedia_thread(
            wikipedia_title=request.wikipedia_title,
            description=request.description,
            user_id=current_user_id
        )

        # Add research_id if provided
        if request.research_id:
            data["thread"]["research_id"] = request.research_id

        thread_repo = SQLAlchemyThreadRepository(db_session)
        await thread_repo.save_thread(data["thread"])
        await thread_repo.save_messages(data["messages"])

        return {
            "message": "Thread uploaded and parsed successfully",
            "thread_id": data["thread"]["thread_id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/thread/{thread_id}", response_model=ThreadResponse)
async def get_thread(
        thread_id: str,
        current_user_id: str = Depends(get_current_user_id),
        db_session: AsyncSession = Depends(get_db_session)
):
    """Get a specific thread by ID"""
    thread_repo = SQLAlchemyThreadRepository(db_session)
    thread = await thread_repo.get_thread_by_id(thread_id)

    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    return thread


@router.get("/thread/{thread_id}/messages", response_model=List[MessageResponse])
async def get_thread_messages(
        thread_id: str,
        current_user_id: str = Depends(get_current_user_id),
        db_session: AsyncSession = Depends(get_db_session)
):
    """Get all messages for a thread"""
    thread_repo = SQLAlchemyThreadRepository(db_session)
    messages = await thread_repo.get_messages_by_thread_id(thread_id)

    if not messages:
        raise HTTPException(status_code=404, detail="No messages found for this thread")

    return messages


@router.get("/threads", response_model=List[ThreadResponse])
async def get_user_threads(
        current_user_id: str = Depends(get_current_user_id),
        research_id: Optional[str] = Query(None),
        db_session: AsyncSession = Depends(get_db_session)
):
    """Get all threads for current user or for a specific research"""
    thread_repo = SQLAlchemyThreadRepository(db_session)

    if research_id:
        threads = await thread_repo.get_threads_by_research_id(research_id)
    else:
        threads = await thread_repo.get_threads_by_user_id(current_user_id)

    return threads


@router.put("/thread/{thread_id}", response_model=ThreadResponse)
async def update_thread(
        thread_id: str,
        request: ThreadUploadRequest,
        current_user_id: str = Depends(get_current_user_id),
        db_session: AsyncSession = Depends(get_db_session)
):
    """Update a thread"""
    thread_repo = SQLAlchemyThreadRepository(db_session)

    # Check thread exists and belongs to user
    thread = await thread_repo.get_thread_by_id(thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    if thread["user_id"] != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this thread")

    # Update thread
    update_data = {
        "description": request.description
    }

    if request.research_id:
        update_data["research_id"] = request.research_id

    updated_thread = await thread_repo.update_thread(thread_id, update_data)
    return updated_thread


@router.delete("/thread/{thread_id}")
async def delete_thread(
        thread_id: str,
        current_user_id: str = Depends(get_current_user_id),
        db_session: AsyncSession = Depends(get_db_session)
):
    """Delete a thread"""
    thread_repo = SQLAlchemyThreadRepository(db_session)

    # Check thread exists and belongs to user
    thread = await thread_repo.get_thread_by_id(thread_id)
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    if thread["user_id"] != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this thread")

    # Delete thread
    success = await thread_repo.delete_thread(thread_id)

    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete thread")

    return {"message": "Thread deleted successfully"}