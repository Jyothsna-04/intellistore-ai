from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from app.core.registry import registry

router = APIRouter()

class ChatRequest(BaseModel):
    prompt: str
    system_prompt: Optional[str] = None
    temperature: float = 0.7
    stream: bool = False

class ChatResponse(BaseModel):
    provider: str
    model: str
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat_completion(req: ChatRequest):
    provider = registry.active_llm_provider
    if not provider:
        raise HTTPException(status_code=500, detail="No active LLM provider configured.")
    
    if req.stream:
        async def event_generator():
            try:
                async for chunk in provider.generate_stream(req.prompt, req.system_prompt, req.temperature):
                    yield f"data: {chunk}\n\n"
                yield "data: [DONE]\n\n"
            except Exception as e:
                yield f"data: [ERROR: {str(e)}]\n\n"
        
        return StreamingResponse(event_generator(), media_type="text/event-stream")
    else:
        try:
            res_text = await provider.generate(req.prompt, req.system_prompt, req.temperature)
            return ChatResponse(
                provider=provider.provider_name,
                model=provider.model_name,
                response=res_text
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"LLM generation failed: {str(e)}")
