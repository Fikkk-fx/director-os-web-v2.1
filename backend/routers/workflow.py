from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from typing import Optional
import os
import httpx
import base64

router = APIRouter()

ATLAS_BASE_URL = "https://api.atlascloud.ai/v1"
ATLAS_API_KEY = os.getenv("ATLAS_API_KEY", "")
CHAT_MODEL = "openai/gpt-5.6-sol"

def _headers():
    return {
        "Authorization": f"Bearer {ATLAS_API_KEY}",
        "Content-Type": "application/json"
    }


@router.post("/chat")
async def chat_with_agent(
    prompt: str = Form(...),
    reference_image: Optional[UploadFile] = File(None)
):
    """Chat with GPT-5.6 Sol via Atlas Cloud /v1/chat/completions"""
    if not ATLAS_API_KEY:
        return {"response": "[Mock] ATLAS_API_KEY not set. Please configure it on your hosting platform."}

    try:
        # Build message content
        content: list = [{"type": "text", "text": prompt}]

        if reference_image:
            raw = await reference_image.read()
            b64 = base64.b64encode(raw).decode("utf-8")
            mime = reference_image.content_type or "image/png"
            content.append({
                "type": "image_url",
                "image_url": {"url": f"data:{mime};base64,{b64}"}
            })

        payload = {
            "model": CHAT_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are Director OS, a world-class cinematic AI assistant. "
                        "Help the user develop film concepts, write detailed screenplays, "
                        "design characters and environments, and craft professional video prompts. "
                        "Be specific, creative, and highly detailed in your responses."
                    )
                },
                {"role": "user", "content": content}
            ],
            "stream": False
        }

        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(
                f"{ATLAS_BASE_URL}/chat/completions",
                headers=_headers(),
                json=payload
            )

        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail=r.text)

        data = r.json()
        text = data["choices"][0]["message"]["content"]
        return {"response": text}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
