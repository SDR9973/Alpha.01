import bcrypt


class PasswordService:
    """Service for password hashing and verification"""

    def hash_password(self, password: str) -> str:
        """Hash a password for secure storage"""
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        return hashed.decode("utf-8")

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )