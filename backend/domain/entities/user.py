from datetime import datetime
from typing import Optional


class User:
    """User entity"""

    def __init__(
            self,
            name: str,
            email: str,
            user_iid: Optional[str] = None,
            password: Optional[str] = None,
            avatar: Optional[str] = None,
            created_at: Optional[datetime] = None,
            is_active: bool = True
    ):
        self.id = user_iid
        self.name = name
        self.email = email
        self.password = password
        self.avatar = avatar
        self.created_at = created_at or datetime.now()
        self.is_active = is_active