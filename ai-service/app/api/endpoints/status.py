from fastapi import APIRouter
from app.core.registry import registry

router = APIRouter()

@router.get("/providers/status")
async def get_providers_status():
    return await registry.get_status()
