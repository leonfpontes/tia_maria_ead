from contextlib import asynccontextmanager
from fastapi import FastAPI

from .core.config import settings
from .api import router as api_router


@asynccontextmanager
def lifespan(app: FastAPI):
    # Hook for startup tasks (e.g., DB checks). Add logic as needed.
    yield


def create_application() -> FastAPI:
    application = FastAPI(
        title="Tia Maria EAD API",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )
    application.include_router(api_router)
    return application


app = FastAPI(lifespan=lifespan)
app.mount("", create_application())
