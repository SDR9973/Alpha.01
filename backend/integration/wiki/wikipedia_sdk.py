from typing import List

import aiohttp
from .model import SearchResult, SearchResponse, Page, PageResponse, ParseResponse


class WikipediaAPI:
    """Async SDK for interacting with the MediaWiki API."""

    def __init__(self, wiki_url: str = "https://en.wikipedia.org/w/api.php"):
        """Initialize the SDK with a Wikipedia API URL."""
        self.wiki_url = wiki_url

    async def _make_request(self, params: dict) -> dict:
        """Make an async HTTP GET request to the MediaWiki API."""
        async with aiohttp.ClientSession() as session:
            async with session.get(self.wiki_url, params=params) as response:
                response.raise_for_status()  # Raise an exception for HTTP errors
                return await response.json()

    async def search_pages(self, query: str, limit: int = 10) -> List[SearchResult]:
        """Search Wikipedia pages by query string asynchronously."""
        params = {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srlimit": limit,
            "format": "json"
        }
        data = await self._make_request(params)
        search_response = SearchResponse.model_validate(data)
        if search_response.error:
            raise ValueError(f"API Error: {search_response.error.info}")
        if not search_response.query or not search_response.query.search:
            return []
        return search_response.query.search

    async def get_page(self, title: str) -> Page:
        """Retrieve the wikitext content of a Wikipedia page asynchronously."""
        params = {
            "action": "query",
            "titles": title,
            "prop": "revisions",
            "rvprop": "content",
            "rvlimit": 1,
            "format": "json"
        }
        data = await self._make_request(params)
        page_response = PageResponse.model_validate(data)
        if page_response.error:
            raise ValueError(f"API Error: {page_response.error.info}")
        if not page_response.query or not page_response.query.pages:
            raise ValueError("No pages found in response")
        pages = page_response.query.pages
        page_id = next(iter(pages))  # Get the first (and typically only) page
        return pages[page_id]

    async def get_page_html(self, title: str) -> str:
        """Retrieve the parsed HTML content of a Wikipedia page asynchronously."""
        params = {
            "action": "parse",
            "page": title,
            "format": "json"
        }
        data = await self._make_request(params)
        parse_response = ParseResponse.model_validate(data)
        if parse_response.error:
            raise ValueError(f"API Error: {parse_response.error.info}")
        if not parse_response.parse:
            raise ValueError("No parse data found")
        return parse_response.parse.text.text

    async def get_talk_page(self, main_title: str) -> Page:
        """Retrieve the talk page for a given Wikipedia page asynchronously."""
        talk_title = f"Talk:{main_title}"
        return await self.get_page(talk_title)

    async def get_talk_page_content(self, main_title: str) -> str:
        """Retrieve the wikitext content of a talk page asynchronously."""
        talk_page = await self.get_talk_page(main_title)
        if talk_page.missing:
            raise ValueError(f"Talk page for {main_title} does not exist")
        return talk_page.revisions[0].content if talk_page.revisions else ""