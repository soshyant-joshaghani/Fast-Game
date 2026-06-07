from fastapi import APIRouter

from app.core.config import settings

utils_router = APIRouter(prefix="/utils", tags=["[SYSTEM] System - Utils"])


@utils_router.get("/health-check/")
async def health_check() -> bool:
    return True


@utils_router.get("/game-server/")
async def game_server() -> dict[str, str]:
    return {"url": settings.GAME_SERVER_URL}
