from datetime import datetime
from typing import Optional


class Research:
    """Research entity"""

    def __init__(
            self,
            name: str,
            description: str,
            user_id: str,
            research_id: Optional[str] = None,
            start_date: Optional[str] = None,
            end_date: Optional[str] = None,
            message_limit: Optional[int] = None,
            file_name: Optional[str] = None,
            anonymized: bool = False,
            created_at: Optional[datetime] = None
    ):
        self.id = research_id
        self.name = name
        self.description = description
        self.user_id = user_id
        self.start_date = start_date
        self.end_date = end_date
        self.message_limit = message_limit
        self.file_name = file_name
        self.anonymized = anonymized
        self.created_at = created_at or datetime.now()