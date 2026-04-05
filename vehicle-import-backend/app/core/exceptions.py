from fastapi import Request, FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
import logging

logger = logging.getLogger(__name__)

# --- Domain Exceptions ---
class AppException(Exception):
    def __init__(self, message: str, name: str = "AppError"):
        self.message = message
        self.name = name
        super().__init__(self.message)

class NotFoundError(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, name="NotFound")

class BadRequestError(AppException):
    def __init__(self, message: str = "Bad request"):
        super().__init__(message=message, name="BadRequest")

class UnauthorizedError(AppException):
    def __init__(self, message: str = "Unauthorized access"):
        super().__init__(message=message, name="Unauthorized")

class ForbiddenError(AppException):
    def __init__(self, message: str = "Access forbidden"):
        super().__init__(message=message, name="Forbidden")

class ConflictError(AppException):
    def __init__(self, message: str = "Resource conflict"):
        super().__init__(message=message, name="Conflict")


# --- Exception Handlers ---
async def app_exception_handler(request: Request, exc: AppException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    if isinstance(exc, NotFoundError):
        status_code = status.HTTP_404_NOT_FOUND
    elif isinstance(exc, BadRequestError):
        status_code = status.HTTP_400_BAD_REQUEST
    elif isinstance(exc, UnauthorizedError):
        status_code = status.HTTP_401_UNAUTHORIZED
    elif isinstance(exc, ForbiddenError):
        status_code = status.HTTP_403_FORBIDDEN
    elif isinstance(exc, ConflictError):
        status_code = status.HTTP_409_CONFLICT

    return JSONResponse(
        status_code=status_code,
        content={"error": exc.name, "message": exc.message},
    )

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "DatabaseError", "message": "An internal database error occurred."},
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": "ValidationError", "message": "Validation error", "details": exc.errors()},
    )

async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "InternalServerError", "message": "An unexpected error occurred."},
    )

def setup_exception_handlers(app: FastAPI):
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)
