from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class APIError(BaseModel):
    """Model for MediaWiki API errors."""
    code: str
    info: str
    docref: Optional[str] = None

class SearchResult(BaseModel):
    """Model for individual search results from the API."""
    ns: int
    title: str
    pageid: int
    size: int
    wordcount: int
    snippet: str
    timestamp: str

class SearchQuery(BaseModel):
    """Model for the 'query' field in search responses."""
    search: List[SearchResult]
    searchinfo: Optional[Dict[str, Any]] = None

class SearchResponse(BaseModel):
    """Model for the full search API response."""
    batchcomplete: Optional[str] = None
    continue_: Optional[Dict[str, Any]] = Field(None, alias="continue")
    query: Optional[SearchQuery]
    error: Optional[APIError] = None

class Revision(BaseModel):
    """Model for page revisions containing content."""
    contentformat: str
    contentmodel: str
    content: str = Field(..., alias="*")

class Page(BaseModel):
    """Model for individual pages returned by the API."""
    pageid: int
    ns: int
    title: str
    revisions: Optional[List[Revision]] = None
    missing: Optional[str] = None

class Query(BaseModel):
    """Model for the 'query' field in page content responses."""
    pages: Dict[str, Page]

class PageResponse(BaseModel):
    """Model for the full page content API response."""
    batchcomplete: Optional[str] = None
    query: Optional[Query]
    error: Optional[APIError] = None

class ParseText(BaseModel):
    """Model for parsed text in HTML responses."""
    text: str = Field(..., alias="*")

class Parse(BaseModel):
    """Model for parsed page data."""
    title: str
    pageid: int
    text: ParseText

class ParseResponse(BaseModel):
    """Model for the full parsed HTML API response."""
    parse: Optional[Parse]
    error: Optional[APIError] = None