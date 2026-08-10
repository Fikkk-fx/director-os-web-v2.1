import os
from pathlib import Path
from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from typing import Optional
import os
import httpx
import base64
import json

router = APIRouter()

ATLAS_BASE_URL = "https://api.atlascloud.ai/v1"
ATLAS_API_KEY = os.getenv("ATLAS_API_KEY", "")
CHAT_MODEL = "openai/gpt-5.6-sol"

# Load workflow and skills context globally to save disk I/O per request
BASE_DIR = Path(__file__).resolve().parent.parent
try:
    with open(BASE_DIR / "director_os_master_workflow.txt", "r", encoding="utf-8") as f:
        MASTER_WORKFLOW = f.read()
except Exception:
    MASTER_WORKFLOW = "Master workflow context is unavailable."

try:
    with open(BASE_DIR / "skills" / "Rangkuman_dan_Kompilasi_Skill.md", "r", encoding="utf-8") as f:
        SKILLS_CONTEXT = f.read()
except Exception:
    SKILLS_CONTEXT = "Skills context is unavailable."

def _headers():
    return {
        "Authorization": f"Bearer {ATLAS_API_KEY}",
        "Content-Type": "application/json"
    }


@router.post("/chat")
async def chat_with_agent(
    prompt: str = Form(...),
    history: str = Form("[]"),
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
            "model": CHAT_MODEL,
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
            raise HTTPException(status_code=r.status_code, detail=r.text)

        data = r.json()
        text = data["choices"][0]["message"]["content"]
        return {"response": text}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
