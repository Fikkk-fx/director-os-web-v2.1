from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from typing import Optional
import uuid
import os
import shutil
import subprocess
import json

router = APIRouter()

# In-memory cache to prevent CLI spam
MODEL_LIST_CACHE = None
MODEL_DETAIL_CACHE = {}

# Fallback static models
FALLBACK_MODELS = [
    {"id": "bytedance/seedance-2.5/text-to-video", "name": "Seedance 2.5 Text-to-Video", "type": "Video", "supports_image": False},
    {"id": "bytedance/seedance-2.5/image-to-video", "name": "Seedance 2.5 Image-to-Video", "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-pro/text-to-video", "name": "Kling v3.0 Pro Text-to-Video", "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-pro/image-to-video", "name": "Kling v3.0 Pro Image-to-Video", "type": "Video", "supports_image": True},
    {"id": "alibaba/wan-2.7/text-to-video", "name": "Wan-2.7 Text-to-Video", "type": "Video", "supports_image": False},
    {"id": "alibaba/wan-2.7/image-to-video", "name": "Wan-2.7 Image-to-Video", "type": "Video", "supports_image": True},
    {"id": "google/gemini-omni-flash/text-to-video", "name": "Gemini Omni Flash Text-to-Video", "type": "Video", "supports_image": False},
    {"id": "seedream/v5", "name": "Seedream V5", "type": "Image", "supports_image": False},
]

@router.get("/models")
async def get_models():
    """Return available models by querying Atlas Cloud CLI"""
    global MODEL_LIST_CACHE
    if MODEL_LIST_CACHE:
        return {"models": MODEL_LIST_CACHE}

    try:
        # Try to run Atlas CLI
        process = subprocess.run(["atlas", "models", "list", "--json"], capture_output=True, text=True, timeout=10)
        if process.returncode == 0:
            data = json.loads(process.stdout)
            
            # Format the list. CLI might return a dict like {"models": [...]} or just a list
            models = data if isinstance(data, list) else data.get("models", [])
            
            # Map the CLI output to our simplified format
            mapped_models = []
            for m in models:
                # atlas-cli might have 'Type' or 'type', 'Name' or 'name', 'Id' or 'id'
                m_type = m.get("type", m.get("Type", "Video"))
                
                # Exclude Audio / Text for this specific workspace UI if needed, or keep them. 
                # We'll map them to "Image" or "Video" just to fit the UI segments for now, or keep actual types.
                mapped_models.append({
                    "id": m.get("id", m.get("Id", "")),
                    "name": m.get("name", m.get("Name", "")),
                    "type": m_type.capitalize() if isinstance(m_type, str) else "Video",
                    "supports_image": "image" in m.get("id", "").lower() or "reference" in m.get("id", "").lower()
                })
            
            MODEL_LIST_CACHE = mapped_models
            return {"models": mapped_models}
            
    except Exception as e:
        print(f"CLI fetch failed: {e}")
    
    # Fallback
    # Do NOT cache the fallback so we retry next time
    return {"models": FALLBACK_MODELS}

@router.get("/models/{model_id:path}")
async def get_model_details(model_id: str):
    """Return detailed parameters/schema for a specific model"""
    if model_id in MODEL_DETAIL_CACHE and "fallback" not in MODEL_DETAIL_CACHE[model_id]:
        return {"model": MODEL_DETAIL_CACHE[model_id]}

    try:
        process = subprocess.run(["atlas", "models", "get", model_id, "--json"], capture_output=True, text=True, timeout=10)
        if process.returncode == 0:
            data = json.loads(process.stdout)
            # Cache and return
            MODEL_DETAIL_CACHE[model_id] = data
            return {"model": data}
    except Exception as e:
        print(f"CLI get model failed: {e}")

    # Fallback default schema for UI rendering if CLI fails
    fallback_schema = {
        "id": model_id,
        "fallback": True,
        "parameters": {
            "aspect_ratio": {"type": "string", "enum": ["16:9", "9:16", "1:1"], "default": "16:9"},
            "duration": {"type": "string", "enum": ["5s", "10s"], "default": "5s"}
        }
    }
    # Do NOT cache fallback persistently, or mark it as fallback
    MODEL_DETAIL_CACHE[model_id] = fallback_schema
    return {"model": fallback_schema}

@router.post("/generate")
async def generate_asset(
    type: str = Form(...),
    prompt: str = Form(...),
    model_keyword: str = Form(...),
    aspect_ratio: str = Form("16:9"),
    duration: str = Form("5s"),
    reference_file: Optional[UploadFile] = File(None)
):
    """
    Endpoint to trigger Atlas Cloud generation.
    Handles form data to support file uploads for reference images.
    """
    try:
        saved_file_path = None
        if reference_file:
            os.makedirs("uploads", exist_ok=True)
            saved_file_path = f"uploads/{uuid.uuid4().hex}_{reference_file.filename}"
            with open(saved_file_path, "wb") as buffer:
                shutil.copyfileobj(reference_file.file, buffer)

        # Mock logic or CLI execution logic here
        mock_prediction_id = f"pred_{uuid.uuid4().hex[:12]}"
        
        file_msg = f" with reference file {reference_file.filename}" if reference_file else ""
        
        return {
            "status": "success",
            "prediction_id": mock_prediction_id,
            "message": f"Submitted {type} task for '{model_keyword}' (AR: {aspect_ratio}, Duration: {duration}){file_msg}.",
            "prompt_used": prompt
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
