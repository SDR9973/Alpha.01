from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from api.routes.users import get_current_user
from integration.wiki import search_wikipedia
from integration.wiki.services import upload_wikipedia_thread, get_wikipedia_talk_page, get_wikipedia_page
from infrastructure.persistence.repositories.thread_repository import SQLAlchemyThreadRepository
from api.dependencies import *
router = APIRouter(prefix="/wikipedia", tags=["wikipedia"])

class ThreadUploadRequest(BaseModel):
    wikipedia_title: str
    description: str = ""

@router.get("/search")
async def search_endpoint(query: str, limit: int = 10):
    try:
        results = await search_wikipedia(query, limit)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/page/{title}")
async def page_endpoint(title: str):
    try:
        page = await get_wikipedia_page(title)
        return page
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/talk/{title}")
async def talk_page_endpoint(title: str):
    try:
        talk_page = await get_wikipedia_talk_page(title)
        return talk_page
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-threaded")
async def upload_thread_endpoint(
    request: ThreadUploadRequest,
    current_user: dict = Depends(get_current_user),
    db_session: AsyncSession = Depends(get_db_session)
):
    try:
        data = await upload_wikipedia_thread(
            wikipedia_title=request.wikipedia_title,
            description=request.description,
            user_id=current_user["user_id"]
        )
        thread_repo = SQLAlchemyThreadRepository(db_session)
        await thread_repo.save_thread(data["thread"])
        await thread_repo.save_messages(data["messages"])
        return {"message": "Thread uploaded and parsed successfully", "thread_id": data["thread"]["thread_id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))