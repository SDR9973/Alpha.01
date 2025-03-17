from datetime import datetime, timedelta
from typing import Dict, Any, Optional

from jose import jwt

from config.settings import settings


class JWTService:
    """Service for JWT token generation and validation"""

    def hash_password(self, password: str) -> str:
        """Not implemented for JWT service"""
        raise NotImplementedError("Use PasswordService for password hashing")

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Not implemented for JWT service"""
        raise NotImplementedError("Use PasswordService for password verification")

    def create_access_token(
            self,
            data: Dict[str, Any],
            expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a JWT access token"""
        to_encode = data.copy()
        expire = datetime.now() + (
                expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    def decode_token(self, token: str) -> Dict[str, Any]:
        """Decode and validate a JWT token"""
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
