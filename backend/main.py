from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
import asyncio
import typer

from api.routes import auth, users, files, research, network, wikipedia
from api.routes.integrations import wikipedia_network
from api.error_handlers import register_exception_handlers
from infrastructure.persistence.database import Base, engine
from config.settings import settings

cli = typer.Typer()

# Create upload directory if it doesn't exist
os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth)
app.include_router(users)
app.include_router(files)
app.include_router(research)
app.include_router(network)
app.include_router(wikipedia)
app.include_router(wikipedia_network.router)

# Register exception handlers
register_exception_handlers(app)


# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to NetXplore API", "version": settings.APP_VERSION}


@cli.command()
def create_tables():
    """Create database tables."""

    async def _create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    asyncio.run(_create_tables())
    typer.echo("Tables created successfully!")


@cli.command()
def run_server(host: str = "127.0.0.1", port: int = 8000):
    """Run the API server."""
    import uvicorn
    typer.echo(f"Starting server at http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=settings.DEBUG)


if __name__ == "__main__":
    cli()
