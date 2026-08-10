from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from typing import Optional
import uuid
import os
import httpx
import base64

router = APIRouter()

ATLAS_BASE_URL = "https://api.atlascloud.ai/v1"
ATLAS_API_KEY = os.getenv("ATLAS_API_KEY", "")

# In-memory cache
MODEL_LIST_CACHE = None

# Fallback static models
FALLBACK_MODELS = [
    {"id": "bytedance/seedance-2.5/text-to-video",   "name": "Seedance 2.5 T2V",       "type": "Video", "supports_image": False},
    {"id": "bytedance/seedance-2.5/image-to-video",  "name": "Seedance 2.5 I2V",       "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-pro/text-to-video",   "name": "Kling v3.0 Pro T2V",     "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-pro/image-to-video",  "name": "Kling v3.0 Pro I2V",     "type": "Video", "supports_image": True},
    {"id": "alibaba/wan-2.7/text-to-video",           "name": "Wan-2.7 T2V",            "type": "Video", "supports_image": False},
    {"id": "alibaba/wan-2.7/image-to-video",          "name": "Wan-2.7 I2V",            "type": "Video", "supports_image": True},
    {"id": "openai/gpt-image-2",                      "name": "GPT Image 2",            "type": "Image", "supports_image": True},
    {"id": "bytedance/seedream-5",                    "name": "Seedream 5.0",           "type": "Image", "supports_image": False},
    {"id": "black-forest-labs/flux-1.1-pro",          "name": "Flux 1.1 Pro",           "type": "Image", "supports_image": False},
]

def _headers():
    return {
        "Authorization": f"Bearer {ATLAS_API_KEY}",
        "Content-Type": "application/json"
    }


@router.get("/models")
async def get_models():
    """Return available models via Atlas Cloud REST API"""
    global MODEL_LIST_CACHE
    if MODEL_LIST_CACHE:
        return {"models": MODEL_LIST_CACHE}

    if not ATLAS_API_KEY:
        return {"models": FALLBACK_MODELS}

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            r = await client.get(f"{ATLAS_BASE_URL}/models", headers=_headers())
            if r.status_code == 200:
                data = r.json()
                raw = data.get("data", data) if isinstance(data, dict) else data

                mapped = []
                for m in raw:
                    mid = m.get("id", "")
                    # Classify type based on id keywords
                    if any(k in mid for k in ["image", "flux", "seedream", "dall-e", "gpt-image"]):
                        mtype = "Image"
                    elif any(k in mid for k in ["video", "seedance", "kling", "wan", "sora"]):
                        mtype = "Video"
                    else:
                        mtype = "LLM"

                    mapped.append({
                        "id": mid,
                        "name": m.get("name", mid.split("/")[-1]),
                        "type": mtype,
                        "supports_image": "image-to" in mid or "i2v" in mid
                    })

                MODEL_LIST_CACHE = mapped
                return {"models": mapped}
    except Exception as e:
        print(f"Atlas API model fetch failed: {e}")

    return {"models": FALLBACK_MODELS}


@router.get("/models/{model_id:path}")
async def get_model_details(model_id: str):
    """Return model details from Atlas Cloud"""
    if not ATLAS_API_KEY:
        return {"model": {"id": model_id, "parameters": {}}}
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(f"{ATLAS_BASE_URL}/models/{model_id}", headers=_headers())
            if r.status_code == 200:
                return {"model": r.json()}
    except Exception as e:
        print(f"Model detail fetch failed: {e}")
    return {"model": {"id": model_id}}


@router.post("/generate")
async def generate_asset(
    type: str = Form(...),
    prompt: str = Form(...),
    model_keyword: str = Form(...),
    aspect_ratio: str = Form("16:9"),
    duration: str = Form("5s"),
    reference_file: Optional[UploadFile] = File(None)
):
    """Submit generation task to Atlas Cloud REST API"""
    try:
        ref_b64 = None
        if reference_file:
            raw = await reference_file.read()
            ref_b64 = base64.b64encode(raw).decode("utf-8")

        prediction_id = f"pred_{uuid.uuid4().hex[:12]}"

        if not ATLAS_API_KEY:
            return {
                "status": "success",
                "prediction_id": prediction_id,
                "message": f"[Mock] {type} task submitted — set ATLAS_API_KEY to use real generation.",
                "prompt_used": prompt
            }

        # Build payload for Atlas Cloud prediction API
        payload: dict = {
            "model": model_keyword,
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
        }
        if type == "Video":
            payload["duration"] = duration
        if ref_b64:
            payload["image"] = f"data:image/jpeg;base64,{ref_b64}"

        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                f"{ATLAS_BASE_URL}/predictions",
                headers=_headers(),
                json=payload
            )
            if r.status_code in (200, 201):
                data = r.json()
                return {
                    "status": "success",
                    "prediction_id": data.get("id", prediction_id),
                    "message": f"{type} generation submitted to Atlas Cloud.",
                    "prompt_used": prompt
                }
            else:
                raise HTTPException(status_code=r.status_code, detail=r.text)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
