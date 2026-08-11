import os
from pathlib import Path
from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Request
from typing import Optional
import httpx
import base64
import json
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()

ATLAS_BASE_URL = "https://api.atlascloud.ai/api/v1"
ATLAS_API_KEY = os.getenv("ATLAS_API_KEY", "")
DEFAULT_CHAT_MODEL = "openai/gpt-5.6-sol"

# Load a trimmed workflow summary to avoid token bloat (only first 8000 chars)
BASE_DIR = Path(__file__).resolve().parent.parent
try:
    with open(BASE_DIR / "director_os_master_workflow.txt", "r", encoding="utf-8") as f:
        _full_workflow = f.read()
    # Use only the first 8000 chars to prevent context overflow on every request
    MASTER_WORKFLOW = _full_workflow[:8000] + ("\n\n[...workflow truncated for context efficiency...]" if len(_full_workflow) > 8000 else "")
except Exception:
    MASTER_WORKFLOW = "Master workflow context is unavailable."

# Skills context is intentionally omitted from per-request system prompt
# to avoid injecting 68KB+ on every message. Reference it only if explicitly needed.
SKILLS_CONTEXT = "Director OS has built-in expertise in film, cinematography, visual storytelling, prompt engineering, and AI-assisted creative production."

def _headers():
    return {
        "Authorization": f"Bearer {ATLAS_API_KEY}",
        "Content-Type": "application/json"
    }


@router.post("/chat")
@limiter.limit("10/minute")
async def chat_with_agent(
    request: Request,
    prompt: str = Form(...),
    history: str = Form("[]"),
    model: str = Form(DEFAULT_CHAT_MODEL),
    reference_image: Optional[UploadFile] = File(None)
):
    """Chat with a language model via Atlas Cloud /api/v1/chat/completions"""
    if not ATLAS_API_KEY:
        return {"response": "[Mock] ATLAS_API_KEY not set. Please configure it on your hosting platform."}

    try:
        # Build message content
        content: list = [{"type": "text", "text": prompt}]

        if reference_image:
            if reference_image.size and reference_image.size > 10 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
            if not reference_image.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
                
            raw = await reference_image.read()
            b64 = base64.b64encode(raw).decode("utf-8")
            mime = reference_image.content_type or "image/png"
            content.append({
                "type": "image_url",
                "image_url": {"url": f"data:{mime};base64,{b64}"}
            })

        system_prompt = (
            "You are Director OS, a world-class cinematic AI assistant. "
            "Help the user develop film concepts, write detailed screenplays, "
            "design characters and environments, and craft professional video prompts. "
            "Be specific, creative, and highly detailed in your responses.\n\n"
            "=== DIRECTOR OS MASTER WORKFLOW ===\n"
            f"{MASTER_WORKFLOW}\n\n"
            "=== AVAILABLE SKILLS ===\n"
            f"{SKILLS_CONTEXT}\n\n"
            "Use the above workflow and skills knowledge to assist the user effectively."
        )

        try:
            past_messages = json.loads(history)
            past_messages = past_messages[-10:]  # Keep only the last 10 messages
        except Exception:
            past_messages = []

        messages_payload = [{"role": "system", "content": system_prompt}]
        
        for msg in past_messages:
            role = "assistant" if msg.get("role") == "ai" else "user"
            text = msg.get("content", "")
            if text:
                messages_payload.append({"role": role, "content": text})

        messages_payload.append({"role": "user", "content": content})

        payload = {
            "model": model,
            "messages": messages_payload,
            "stream": False
        }

        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(
                f"{ATLAS_BASE_URL}/chat/completions",
                headers=_headers(),
                json=payload
            )

        if r.status_code != 200:
            # Sanitize: do not leak raw Atlas internal error structure to the client
            try:
                err_body = r.json()
                err_msg = err_body.get("error", {}).get("message") or err_body.get("detail") or "Atlas Chat API error"
            except Exception:
                err_msg = "Atlas Chat API returned an error. Please try again."
            logger.error(f"Atlas chat error: status={r.status_code} body={r.text[:300]}")
            raise HTTPException(status_code=r.status_code, detail=err_msg)

        data = r.json()
        text = data["choices"][0]["message"]["content"]
        return {"response": text}

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Atlas request failed")
        raise HTTPException(status_code=500, detail="Internal server error")
