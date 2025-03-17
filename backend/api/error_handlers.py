from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from jose import JWTError

from domain.exceptions.domain_exceptions import (
    DomainException,
    EntityNotFoundException,
    ValidationException,
    BusinessRuleException,
    AuthorizationException
)


async def domain_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
    """Handler for domain exceptions"""

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )


async def entity_not_found_handler(_request: Request, exc: Exception) -> JSONResponse:
    """Handler for entity not found exceptions"""
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": str(exc)},
    )


async def validation_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
    """Handler for validation exceptions"""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )


async def business_rule_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
    """Handler for business rule exceptions"""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )


async def authorization_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
    """Handler for authorization exceptions"""
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={"detail": str(exc)},
    )


async def jwt_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
    """Handler for JWT exceptions"""
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": f"Invalid authentication credentials: {str(exc)}"},
        headers={"WWW-Authenticate": "Bearer"},
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Register all exception handlers for the application"""
    app.add_exception_handler(DomainException, domain_exception_handler)
    app.add_exception_handler(EntityNotFoundException, entity_not_found_handler)
    app.add_exception_handler(ValidationException, validation_exception_handler)
    app.add_exception_handler(BusinessRuleException, business_rule_exception_handler)
    app.add_exception_handler(AuthorizationException, authorization_exception_handler)
    app.add_exception_handler(JWTError, jwt_exception_handler)
