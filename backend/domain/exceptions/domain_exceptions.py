class DomainException(Exception):
    """Base exception for domain errors"""
    pass

class EntityNotFoundException(DomainException):
    """Exception raised when an entity is not found"""
    def __init__(self, entity_type: str, entity_id: str):
        self.entity_type = entity_type
        self.entity_id = entity_id
        super().__init__(f"{entity_type} with id '{entity_id}' not found")

class ValidationException(DomainException):
    """Exception raised when entity validation fails"""
    pass

class BusinessRuleException(DomainException):
    """Exception raised when a business rule is violated"""
    pass

class AuthorizationException(DomainException):
    """Exception raised when authorization fails"""
    def __init__(self, message: str = "Not authorized to perform this action"):
        super().__init__(message)