from fastapi import APIRouter

from .routes import health
from .auth import router as auth_router
from .auth_password_reset import router as password_reset_router
from .dashboard import router as dashboard_router

router = APIRouter()
router.include_router(health.router, tags=["health"])
router.include_router(auth_router)
router.include_router(password_reset_router)
router.include_router(dashboard_router)