"""
Main FastAPI application
IBM Sales Coaching Dashboard Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os

from app.config import settings
from app.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    print("Starting up IBM Sales Coaching API...")
    init_db()
    print("Database initialized")
    # Auto-seed if DB is empty
    _auto_seed()
    yield
    # Shutdown
    print("Shutting down...")


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "IBM Sales Coaching API",
        "version": settings.VERSION,
        "status": "healthy",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.VERSION
    }


# Import and include routers
from app.api import reps
from app.api import opportunities
from app.api import sync
from app.api import learning
from app.api import activities
app.include_router(reps.router,          prefix=f"{settings.API_V1_PREFIX}/reps",          tags=["reps"])
app.include_router(opportunities.router, prefix=f"{settings.API_V1_PREFIX}/opportunities", tags=["opportunities"])
app.include_router(sync.router,          prefix=f"{settings.API_V1_PREFIX}/sync",          tags=["sync"])
app.include_router(learning.router,      prefix=f"{settings.API_V1_PREFIX}/learning",      tags=["learning"])
app.include_router(activities.router,    prefix=f"{settings.API_V1_PREFIX}/activities",    tags=["activities"])

# Serve the dashboard frontend as static files so one server handles everything
_frontend_dir = os.path.join(os.path.dirname(__file__), "..", "..", "northstar_dashboard")
if os.path.isdir(_frontend_dir):
    app.mount("/dashboard", StaticFiles(directory=_frontend_dir, html=True), name="dashboard")
    @app.get("/dashboard", include_in_schema=False)
    async def serve_dashboard():
        return FileResponse(os.path.join(_frontend_dir, "index.html"))


def _auto_seed():
    """Seed the database on first run if no reps exist yet."""
    from app.database import SessionLocal
    from app.models.rep import Rep
    db = SessionLocal()
    try:
        count = db.query(Rep).count()
        if count == 0:
            print("No data found — auto-seeding database...")
            from app.seed.seed_data import seed_all
            seed_all(db)
    except Exception as e:
        print(f"Auto-seed warning: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD
    )

# Made with Bob
