from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import check_database_connection

from app.api.routes.catalog import router as catalog_router
from app.models import catalog
from app.core.database import Base, engine


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(catalog_router, prefix="/api")


@app.get("/")
def root():
    return {
        "app": settings.app_name,
        "env": settings.app_env,
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "database": "connected" if check_database_connection() else "disconnected",
    }
