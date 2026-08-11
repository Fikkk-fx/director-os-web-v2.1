from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Request
from typing import Optional
import uuid
import os
import httpx
import base64
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()

ATLAS_BASE_URL = "https://api.atlascloud.ai/v1"
ATLAS_API_KEY = os.getenv("ATLAS_API_KEY", "")

# In-memory cache
MODEL_LIST_CACHE = None

# ─────────────────────────────────────────────────────────────────────────────
# COMPLETE MODEL CATALOGUE  (sourced live from Atlas Cloud, August 2026)
# ─────────────────────────────────────────────────────────────────────────────
IMAGE_MODELS = [
    # ── OpenAI ──────────────────────────────────────────────────────────────
    {"id": "openai/gpt-image-2/text-to-image",        "name": "GPT Image 2 · T2I",             "type": "Image", "supports_image": False},
    {"id": "openai/gpt-image-2/edit",                 "name": "GPT Image 2 · Edit",            "type": "Image", "supports_image": True},
    {"id": "openai/gpt-image-1.5/text-to-image",      "name": "GPT Image 1.5 · T2I",           "type": "Image", "supports_image": False},
    {"id": "openai/gpt-image-1.5/edit",               "name": "GPT Image 1.5 · Edit",          "type": "Image", "supports_image": True},
    {"id": "openai/gpt-image-1/text-to-image",        "name": "GPT Image 1 · T2I",             "type": "Image", "supports_image": False},
    {"id": "openai/gpt-image-1/edit",                 "name": "GPT Image 1 · Edit",            "type": "Image", "supports_image": True},
    {"id": "openai/gpt-image-1-mini/text-to-image",   "name": "GPT Image 1 Mini · T2I",        "type": "Image", "supports_image": False},
    {"id": "openai/gpt-image-1-mini/edit",            "name": "GPT Image 1 Mini · Edit",       "type": "Image", "supports_image": True},
    # ── Google Nano Banana ───────────────────────────────────────────────────
    {"id": "google/nano-banana-2/text-to-image",       "name": "Nano Banana 2 · T2I",          "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-2/edit",                "name": "Nano Banana 2 · Edit",         "type": "Image", "supports_image": True},
    {"id": "google/nano-banana-2/reference-to-image",  "name": "Nano Banana 2 · Ref2Img",      "type": "Image", "supports_image": True},
    {"id": "google/nano-banana-pro/text-to-image",     "name": "Nano Banana Pro · T2I",        "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-pro/text-to-image-ultra","name": "Nano Banana Pro · Ultra",      "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-pro/edit",              "name": "Nano Banana Pro · Edit",       "type": "Image", "supports_image": True},
    {"id": "google/nano-banana-2-lite/text-to-image",  "name": "Nano Banana 2 Lite · T2I",     "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-2-lite/edit",           "name": "Nano Banana 2 Lite · Edit",    "type": "Image", "supports_image": True},
    # ── Alibaba / Wan ────────────────────────────────────────────────────────
    {"id": "alibaba/wan-2.7/text-to-image",            "name": "Wan-2.7 · T2I",                "type": "Image", "supports_image": False},
    {"id": "alibaba/wan-2.7/image-edit",               "name": "Wan-2.7 · Edit",               "type": "Image", "supports_image": True},
    {"id": "alibaba/wan-2.7-pro/text-to-image",        "name": "Wan-2.7 Pro · T2I",            "type": "Image", "supports_image": False},
    {"id": "alibaba/wan-2.7-pro/image-edit",           "name": "Wan-2.7 Pro · Edit",           "type": "Image", "supports_image": True},
    # ── Midjourney (Youchuan) ────────────────────────────────────────────────
    {"id": "youchuan/v8.2/text-to-image",              "name": "Midjourney V8.2 · T2I",        "type": "Image", "supports_image": False},
    {"id": "youchuan/v8.2/image-to-image",             "name": "Midjourney V8.2 · I2I",        "type": "Image", "supports_image": True},
    {"id": "youchuan/v8.2/blend",                      "name": "Midjourney V8.2 · Blend",      "type": "Image", "supports_image": True},
    {"id": "youchuan/v8.2/style-transfer",             "name": "Midjourney V8.2 · Style",      "type": "Image", "supports_image": True},
    {"id": "youchuan/v8.1/text-to-image",              "name": "Midjourney V8.1 · T2I",        "type": "Image", "supports_image": False},
    {"id": "youchuan/v8.1/image-to-image",             "name": "Midjourney V8.1 · I2I",        "type": "Image", "supports_image": True},
]

VIDEO_MODELS = [
    # ── ByteDance Seedance ───────────────────────────────────────────────────
    {"id": "bytedance/seedance-2.5/text-to-video",      "name": "Seedance 2.5 · T2V",           "type": "Video", "supports_image": False},
    {"id": "bytedance/seedance-2.5/image-to-video",     "name": "Seedance 2.5 · I2V",           "type": "Video", "supports_image": True},
    {"id": "bytedance/seedance-2.5/reference-to-video", "name": "Seedance 2.5 · Ref2V",         "type": "Video", "supports_image": True},
    {"id": "bytedance/seedance-2.0/text-to-video",      "name": "Seedance 2.0 · T2V",           "type": "Video", "supports_image": False},
    {"id": "bytedance/seedance-2.0/image-to-video",     "name": "Seedance 2.0 · I2V",           "type": "Video", "supports_image": True},
    {"id": "bytedance/seedance-2.0-fast/text-to-video", "name": "Seedance 2.0 Fast · T2V",      "type": "Video", "supports_image": False},
    {"id": "bytedance/seedance-2.0-fast/image-to-video","name": "Seedance 2.0 Fast · I2V",      "type": "Video", "supports_image": True},
    # ── Kuaishou Kling ───────────────────────────────────────────────────────
    {"id": "kwaivgi/kling-v3.0-pro/text-to-video",     "name": "Kling v3.0 Pro · T2V",         "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-pro/image-to-video",    "name": "Kling v3.0 Pro · I2V",         "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-4k/text-to-video",      "name": "Kling v3.0 4K · T2V",          "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-4k/image-to-video",     "name": "Kling v3.0 4K · I2V",          "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-std/text-to-video",     "name": "Kling v3.0 Std · T2V",         "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-std/image-to-video",    "name": "Kling v3.0 Std · I2V",         "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-pro/text-to-video", "name": "Kling O3 Pro · T2V",           "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-video-o3-pro/image-to-video","name": "Kling O3 Pro · I2V",           "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v2.6-pro/text-to-video",     "name": "Kling v2.6 Pro · T2V",         "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v2.6-pro/image-to-video",    "name": "Kling v2.6 Pro · I2V",         "type": "Video", "supports_image": True},
    # ── Alibaba Wan ──────────────────────────────────────────────────────────
    {"id": "alibaba/wan-2.7/text-to-video",             "name": "Wan-2.7 · T2V",                "type": "Video", "supports_image": False},
    {"id": "alibaba/wan-2.7/image-to-video",            "name": "Wan-2.7 · I2V",                "type": "Video", "supports_image": True},
    {"id": "alibaba/wan-2.7/reference-to-video",        "name": "Wan-2.7 · Ref2V",              "type": "Video", "supports_image": True},
    {"id": "alibaba/wan-2.6/text-to-video",             "name": "Wan-2.6 · T2V",                "type": "Video", "supports_image": False},
    {"id": "alibaba/wan-2.6/image-to-video",            "name": "Wan-2.6 · I2V",                "type": "Video", "supports_image": True},
    # ── MiniMax / Hailuo ─────────────────────────────────────────────────────
    {"id": "minimax/h3/text-to-video",                  "name": "MiniMax H3 · T2V",             "type": "Video", "supports_image": False},
    {"id": "minimax/h3/image-to-video",                 "name": "MiniMax H3 · I2V",             "type": "Video", "supports_image": True},
    {"id": "minimax/h3/reference-to-video",             "name": "MiniMax H3 · Ref2V",           "type": "Video", "supports_image": True},
    {"id": "minimax/hailuo-2.3/t2v-pro",                "name": "Hailuo 2.3 Pro · T2V",         "type": "Video", "supports_image": False},
    {"id": "minimax/hailuo-2.3/t2v-standard",           "name": "Hailuo 2.3 Standard · T2V",    "type": "Video", "supports_image": False},
    {"id": "minimax/hailuo-2.3/i2v-pro",                "name": "Hailuo 2.3 Pro · I2V",         "type": "Video", "supports_image": True},
    {"id": "minimax/hailuo-2.3/i2v-standard",           "name": "Hailuo 2.3 Standard · I2V",    "type": "Video", "supports_image": True},
]

FALLBACK_MODELS = IMAGE_MODELS + VIDEO_MODELS


def _headers():
    return {
        "Authorization": f"Bearer {ATLAS_API_KEY}",
        "Content-Type": "application/json"
    }


def _get_supported_params(mtype, mid):
    mid_low = mid.lower()
    params = ["aspect_ratio"]

    if mtype == "Video":
        params.append("duration")
        if "kwaivgi" in mid_low or "kling" in mid_low:
            params.extend(["guidance_scale", "generate_audio", "negative_prompt"])
        elif "minimax" in mid_low or "hailuo" in mid_low:
            params.extend(["resolution"])
        elif "bytedance" in mid_low or "seedance" in mid_low:
            params.extend(["resolution", "output_format", "generate_audio", "watermark", "return_last_frame"])
        elif "alibaba" in mid_low or "wan" in mid_low:
            params.extend(["resolution", "seed"])
        return params

    if "youchuan" in mid_low or "midjourney" in mid_low:
        params.extend(["hd", "stylize", "chaos", "weird", "output_quality", "seed", "sref"])
        return params

    if "gpt" in mid_low or "openai" in mid_low:
        params.extend(["resolution", "output_quality", "output_format"])
        return params

    if "nano-banana" in mid_low:
        params.extend(["resolution", "thinking_level", "media_resolution", "output_format"])
        return params

    # Wan image
    if "wan" in mid_low or "alibaba" in mid_low:
        params.extend(["negative_prompt", "seed", "guidance_scale"])
        return params

    # Default for other image models
    params.extend(["negative_prompt", "seed", "num_outputs", "output_format", "output_quality", "guidance_scale", "num_inference_steps"])
    return params


@router.get("/models")
async def get_models():
    """Return curated model catalogue — Image: GPT, Midjourney, Nano Banana, Wan | Video: Kling, Seedance, MiniMax, Wan."""
    global MODEL_LIST_CACHE
    if MODEL_LIST_CACHE:
        return {"models": MODEL_LIST_CACHE}

    # Build from curated FALLBACK_MODELS
    model_list = []
    for m in FALLBACK_MODELS:
        m_copy = dict(m)
        m_copy["supported_params"] = _get_supported_params(m["type"], m["id"])
        model_list.append(m_copy)

    MODEL_LIST_CACHE = model_list
    return {"models": MODEL_LIST_CACHE}


@router.get("/models/{model_id:path}")
async def get_model_details(model_id: str):
    """Return model detail from Atlas Cloud."""
    if not ATLAS_API_KEY:
        return {"model": {"id": model_id}}
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(f"{ATLAS_BASE_URL}/models/{model_id}", headers=_headers())
            if r.status_code == 200:
                return {"model": r.json()}
    except Exception:
        logger.exception(f"Model detail fetch failed for {model_id}")
    return {"model": {"id": model_id}}


@router.post("/generate")
@limiter.limit("10/minute")
async def generate_asset(
    request: Request,
    type: str = Form(...),
    prompt: str = Form(...),
    model_keyword: str = Form(...),
    aspect_ratio: str = Form("16:9"),
    duration: str = Form("5s"),
    negative_prompt: Optional[str] = Form(None),
    num_outputs: Optional[int] = Form(None),
    output_format: Optional[str] = Form(None),
    output_quality: Optional[int] = Form(None),
    guidance_scale: Optional[float] = Form(None),
    num_inference_steps: Optional[int] = Form(None),
    seed: Optional[int] = Form(None),
    resolution: Optional[str] = Form(None),
    generate_audio: Optional[str] = Form(None),   # keep as str – booleans via Form are tricky
    hd: Optional[str] = Form(None),
    stylize: Optional[int] = Form(None),
    chaos: Optional[int] = Form(None),
    weird: Optional[int] = Form(None),
    sref: Optional[str] = Form(None),
    watermark: Optional[str] = Form(None),
    return_last_frame: Optional[str] = Form(None),
    thinking_level: Optional[str] = Form(None),
    media_resolution: Optional[str] = Form(None),
    reference_file: Optional[UploadFile] = File(None)
):
    """Submit generation task to Atlas Cloud REST API."""
    try:
        # --- Upload validation ---
        if reference_file:
            ct = reference_file.content_type or ""
            if not (ct.startswith("image/") or ct.startswith("video/")):
                raise HTTPException(status_code=400, detail="Invalid file type. Only images or videos are allowed.")
            # Read and size-check
            raw_bytes = await reference_file.read()
            if len(raw_bytes) > 10 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")
        else:
            raw_bytes = None

        prediction_id = f"pred_{uuid.uuid4().hex[:12]}"

        if not ATLAS_API_KEY:
            return {
                "status": "success",
                "prediction_id": prediction_id,
                "message": f"[Mock] {type} task submitted — set ATLAS_API_KEY to use real generation.",
                "prompt_used": prompt
            }

        mid_low = model_keyword.lower()

        payload: dict = {
            "model": model_keyword,
            "prompt": prompt,
        }

        # ── Aspect ratio key mapping ──────────────────────────────────────────
        # MiniMax/Hailuo/Seedance expect "ratio" instead of "aspect_ratio"
        if "minimax" in mid_low or "hailuo" in mid_low or "seedance" in mid_low or "bytedance" in mid_low:
            payload["ratio"] = aspect_ratio
        else:
            payload["aspect_ratio"] = aspect_ratio

        # ── Duration (Video only) ─────────────────────────────────────────────
        if type == "Video":
            try:
                dur_int = int(str(duration).replace("s", "").strip())
                payload["duration"] = dur_int
            except ValueError:
                payload["duration"] = 5

        # ── Upload reference image/video ──────────────────────────────────────
        async with httpx.AsyncClient(timeout=120) as client:
            if raw_bytes is not None:
                upload_res = await client.post(
                    f"{ATLAS_BASE_URL}/model/uploadMedia",
                    headers={"Authorization": f"Bearer {ATLAS_API_KEY}"},
                    files={"file": (reference_file.filename, raw_bytes, reference_file.content_type)}
                )
                if upload_res.status_code in (200, 201):
                    upload_data = upload_res.json()
                    image_url = (
                        upload_data.get("url") or
                        upload_data.get("media_url") or
                        upload_data.get("image_url")
                    )
                    if image_url:
                        payload["image"] = image_url
                        payload["image_url"] = image_url  # some models prefer image_url
                else:
                    logger.warning(f"Media upload failed ({upload_res.status_code}): {upload_res.text[:200]}")
                    # Fallback: send as base64
                    ref_b64 = base64.b64encode(raw_bytes).decode("utf-8")
                    payload["image"] = f"data:{reference_file.content_type};base64,{ref_b64}"

            # ── Optional parameters ───────────────────────────────────────────
            if negative_prompt:           payload["negative_prompt"]      = negative_prompt
            if num_outputs:               payload["num_outputs"]           = num_outputs
            if output_format:             payload["output_format"]         = output_format
            if output_quality:            payload["output_quality"]        = output_quality
            if guidance_scale:            payload["guidance_scale"]        = guidance_scale
            if num_inference_steps:       payload["num_inference_steps"]   = num_inference_steps
            if seed is not None:          payload["seed"]                  = seed
            if stylize is not None:       payload["stylize"]               = stylize
            if chaos is not None:         payload["chaos"]                 = chaos
            if weird is not None:         payload["weird"]                 = weird
            if sref:                      payload["sref"]                  = sref
            if thinking_level:            payload["thinking_level"]        = thinking_level
            if media_resolution:          payload["media_resolution"]      = media_resolution

            # Bool-as-string fields
            def _bool(v): return v.lower() in ("true", "1", "yes") if v else None

            if _bool(hd) is not None:              payload["hd"]               = _bool(hd)
            if _bool(watermark) is not None:        payload["watermark"]        = _bool(watermark)
            if _bool(return_last_frame) is not None:payload["return_last_frame"] = _bool(return_last_frame)

            if generate_audio is not None:
                gen_audio_bool = _bool(generate_audio)
                if gen_audio_bool is not None:
                    payload["generate_audio"] = gen_audio_bool
                    if "kling" in mid_low or "kwaivgi" in mid_low:
                        payload["sound"] = gen_audio_bool  # Kling uses "sound"

            # ── Resolution / size mapping ─────────────────────────────────────
            if resolution:
                if "gpt" in mid_low or "openai" in mid_low:
                    # GPT uses explicit size strings
                    size_map = {
                        "720p":  "1024x768",
                        "1080p": "1024x1024",
                        "1440p": "1536x1024",
                        "2k":    "1536x1024",
                        "4k":    "2048x1152",
                    }
                    payload["size"] = size_map.get(resolution.lower(), "1024x1024")
                else:
                    payload["resolution"] = resolution

            # ── Send to Atlas ────────────────────────────────────────────────
            endpoint = "/model/generateVideo" if type == "Video" else "/model/generateImage"
            r = await client.post(
                f"{ATLAS_BASE_URL}{endpoint}",
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
    except Exception:
        logger.exception("Atlas Cloud generation failed")
        raise HTTPException(status_code=500, detail="Internal server error")
