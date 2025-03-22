from typing import List, Dict, Any
from datetime import datetime
from uuid import uuid4

from dateutil import parser
import re
from .wikipedia_sdk import WikipediaAPI

# Initialize the Wikipedia API client
wiki_api = WikipediaAPI()


async def parse_talk_page(content: str) -> List[Dict[str, Any]]:
    """
    Parse talk page wikitext into a list of messages asynchronously.
    This is a basic implementation that splits by sections and signatures.
    For production, consider using an async-capable wikitext parser like mwparserfromhell.
    """
    messages = []
    sections = re.split(r'(?=^==[^=].*==$)', content, flags=re.MULTILINE)

    for section in sections:
        if not section.strip():
            continue
        signature_pattern = r'(\[\[User:([^\|]+)\|?.*?\]\]\s*~~~~|\s*~~~~)'
        parts = re.split(signature_pattern, section)

        for i in range(0, len(parts) - 1, 3):
            message_content = parts[i].strip()
            if not message_content:
                continue
            sender = parts[i + 1] if i + 1 < len(parts) and parts[i + 1] else "Unknown"
            timestamp_str = parts[i + 2] or ""
            timestamp_match = re.search(r'(\d{2}:\d{2}, \d+ \w+ \d{4} \(UTC\))', timestamp_str)
            if timestamp_match:
                timestamp_str = timestamp_match.group(1)
                try:
                    timestamp = parser.parse(timestamp_str)
                except ValueError:
                    timestamp = datetime.utcnow()
            else:
                timestamp = datetime.utcnow()

            messages.append({
                "timestamp": timestamp,
                "sender": sender,
                "content": message_content
            })

    return messages


async def search_wikipedia(query: str, limit: int = 10) -> List[Dict[str, str]]:
    """Service to search Wikipedia pages and return titles and snippets asynchronously."""
    try:
        results = await wiki_api.search_pages(query, limit)
        return [{"title": r.title, "snippet": r.snippet} for r in results]
    except ValueError as e:
        raise Exception(f"Search failed: {str(e)}")
    except Exception as e:
        raise Exception(f"Internal error during search: {str(e)}")


async def get_wikipedia_page(title: str) -> Dict[str, str]:
    """Service to retrieve the wikitext content of a Wikipedia page asynchronously."""
    try:
        page = await wiki_api.get_page(title)
        if page.missing:
            return {"title": title, "content": "", "error": "Page not found"}
        content = page.revisions[0].content if page.revisions else ""
        return {"title": page.title, "content": content}
    except ValueError as e:
        raise Exception(f"Page retrieval failed: {str(e)}")
    except Exception as e:
        raise Exception(f"Internal error retrieving page: {str(e)}")


async def get_wikipedia_talk_page(title: str) -> Dict[str, str]:
    """Service to retrieve the wikitext content of a talk page asynchronously."""
    try:
        content = await wiki_api.get_talk_page_content(title)
        return {"title": f"Talk:{title}", "content": content}
    except ValueError as e:
        raise Exception(f"Talk page retrieval failed: {str(e)}")
    except Exception as e:
        raise Exception(f"Internal error retrieving talk page: {str(e)}")


async def upload_wikipedia_thread(wikipedia_title: str, description: str, user_id: str) -> Dict[str, Any]:
    thread_id = str(uuid4())
    talk_content = await wiki_api.get_talk_page_content(wikipedia_title)
    messages = await parse_talk_page(talk_content)
    thread_data = {
        "thread_id": thread_id,
        "user_id": user_id,
        "wikipedia_title": wikipedia_title,
        "description": description,
        "upload_date": datetime.utcnow()
    }
    return {
        "thread": thread_data,
        "messages": messages
    }
