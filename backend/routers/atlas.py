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

# ─────────────────────────────────────────────────────────────────────────────
# CURATED MODEL CATALOGUE  — serves as the ALLOWLIST (only these IDs accepted)
# Image: GPT, Midjourney, Nano Banana, Wan
# Video: Kling, Seedance, MiniMax, Wan
# ─────────────────────────────────────────────────────────────────────────────
_CATALOGUE = [
    # ── Image: OpenAI GPT ────────────────────────────────────────────────────
    {"id": "openai/gpt-image-2/text-to-image",        "name": "GPT Image 2 · T2I",             "type": "Image", "supports_image": False},
    {"id": "openai/gpt-image-2/edit",                 "name": "GPT Image 2 · Edit",            "type": "Image", "supports_image": True},
    {"id": "openai/gpt-image-1.5/text-to-image",      "name": "GPT Image 1.5 · T2I",           "type": "Image", "supports_image": False},
    {"id": "openai/gpt-image-1.5/edit",               "name": "GPT Image 1.5 · Edit",          "type": "Image", "supports_image": True},
    {"id": "openai/gpt-image-1/text-to-image",        "name": "GPT Image 1 · T2I",             "type": "Image", "supports_image": False},
    {"id": "openai/gpt-image-1/edit",                 "name": "GPT Image 1 · Edit",            "type": "Image", "supports_image": True},
    {"id": "openai/gpt-image-1-mini/text-to-image",   "name": "GPT Image 1 Mini · T2I",        "type": "Image", "supports_image": False},
    {"id": "openai/gpt-image-1-mini/edit",            "name": "GPT Image 1 Mini · Edit",       "type": "Image", "supports_image": True},
    # ── Image: Midjourney (Youchuan) ─────────────────────────────────────────
    {"id": "youchuan/v8.2/text-to-image",             "name": "Midjourney V8.2 · T2I",         "type": "Image", "supports_image": False},
    {"id": "youchuan/v8.2/image-to-image",            "name": "Midjourney V8.2 · I2I",         "type": "Image", "supports_image": True},
    {"id": "youchuan/v8.2/blend",                     "name": "Midjourney V8.2 · Blend",       "type": "Image", "supports_image": True},
    {"id": "youchuan/v8.2/style-transfer",            "name": "Midjourney V8.2 · Style",       "type": "Image", "supports_image": True},
    {"id": "youchuan/v8.1/text-to-image",             "name": "Midjourney V8.1 · T2I",         "type": "Image", "supports_image": False},
    {"id": "youchuan/v8.1/image-to-image",            "name": "Midjourney V8.1 · I2I",         "type": "Image", "supports_image": True},
    # ── Image: Google Nano Banana ────────────────────────────────────────────
    {"id": "google/nano-banana-2/text-to-image",      "name": "Nano Banana 2 · T2I",           "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-2/edit",               "name": "Nano Banana 2 · Edit",          "type": "Image", "supports_image": True},
    {"id": "google/nano-banana-2/reference-to-image", "name": "Nano Banana 2 · Ref2Img",       "type": "Image", "supports_image": True},
    {"id": "google/nano-banana-pro/text-to-image",    "name": "Nano Banana Pro · T2I",         "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-pro/text-to-image-ultra","name": "Nano Banana Pro · Ultra",     "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-pro/edit",             "name": "Nano Banana Pro · Edit",        "type": "Image", "supports_image": True},
    {"id": "google/nano-banana-2-lite/text-to-image", "name": "Nano Banana 2 Lite · T2I",      "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-2-lite/edit",          "name": "Nano Banana 2 Lite · Edit",     "type": "Image", "supports_image": True},
    # ── Image: Alibaba Wan ───────────────────────────────────────────────────
    {"id": "alibaba/wan-2.7/text-to-image",           "name": "Wan-2.7 · T2I",                 "type": "Image", "supports_image": False},
    {"id": "alibaba/wan-2.7/image-edit",              "name": "Wan-2.7 · Edit",                "type": "Image", "supports_image": True},
    {"id": "alibaba/wan-2.7-pro/text-to-image",       "name": "Wan-2.7 Pro · T2I",             "type": "Image", "supports_image": False},
    {"id": "alibaba/wan-2.7-pro/image-edit",          "name": "Wan-2.7 Pro · Edit",            "type": "Image", "supports_image": True},
    # ── Video: ByteDance Seedance ────────────────────────────────────────────
    {"id": "bytedance/seedance-2.5/text-to-video",    "name": "Seedance 2.5 · T2V",            "type": "Video", "supports_image": False},
    {"id": "bytedance/seedance-2.5/image-to-video",   "name": "Seedance 2.5 · I2V",            "type": "Video", "supports_image": True},
    {"id": "bytedance/seedance-2.5/reference-to-video","name": "Seedance 2.5 · Ref2V",         "type": "Video", "supports_image": True},
    {"id": "bytedance/seedance-2.0/text-to-video",    "name": "Seedance 2.0 · T2V",            "type": "Video", "supports_image": False},
    {"id": "bytedance/seedance-2.0/image-to-video",   "name": "Seedance 2.0 · I2V",            "type": "Video", "supports_image": True},
    {"id": "bytedance/seedance-2.0-fast/text-to-video","name": "Seedance 2.0 Fast · T2V",      "type": "Video", "supports_image": False},
    {"id": "bytedance/seedance-2.0-fast/image-to-video","name": "Seedance 2.0 Fast · I2V",     "type": "Video", "supports_image": True},
    # ── Video: Kuaishou Kling ────────────────────────────────────────────────
    {"id": "kwaivgi/kling-v3.0-pro/text-to-video",   "name": "Kling v3.0 Pro · T2V",          "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-pro/image-to-video",  "name": "Kling v3.0 Pro · I2V",          "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-4k/text-to-video",    "name": "Kling v3.0 4K · T2V",           "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-4k/image-to-video",   "name": "Kling v3.0 4K · I2V",           "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-std/text-to-video",   "name": "Kling v3.0 Std · T2V",          "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-std/image-to-video",  "name": "Kling v3.0 Std · I2V",          "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-pro/text-to-video","name": "Kling O3 Pro · T2V",            "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-video-o3-pro/image-to-video","name": "Kling O3 Pro · I2V",           "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v2.6-pro/text-to-video",   "name": "Kling v2.6 Pro · T2V",          "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v2.6-pro/image-to-video",  "name": "Kling v2.6 Pro · I2V",          "type": "Video", "supports_image": True},
    # ── Video: Alibaba Wan ───────────────────────────────────────────────────
    {"id": "alibaba/wan-2.7/text-to-video",           "name": "Wan-2.7 · T2V",                 "type": "Video", "supports_image": False},
    {"id": "alibaba/wan-2.7/image-to-video",          "name": "Wan-2.7 · I2V",                 "type": "Video", "supports_image": True},
    {"id": "alibaba/wan-2.7/reference-to-video",      "name": "Wan-2.7 · Ref2V",               "type": "Video", "supports_image": True},
    {"id": "alibaba/wan-2.6/text-to-video",           "name": "Wan-2.6 · T2V",                 "type": "Video", "supports_image": False},
    {"id": "alibaba/wan-2.6/image-to-video",          "name": "Wan-2.6 · I2V",                 "type": "Video", "supports_image": True},
    # ── Video: MiniMax / Hailuo ──────────────────────────────────────────────
    {"id": "minimax/h3/text-to-video",                "name": "MiniMax H3 · T2V",              "type": "Video", "supports_image": False},
    {"id": "minimax/h3/image-to-video",               "name": "MiniMax H3 · I2V",              "type": "Video", "supports_image": True},
    {"id": "minimax/h3/reference-to-video",           "name": "MiniMax H3 · Ref2V",            "type": "Video", "supports_image": True},
    {"id": "minimax/hailuo-2.3/t2v-pro",              "name": "Hailuo 2.3 Pro · T2V",          "type": "Video", "supports_image": False},
    {"id": "minimax/hailuo-2.3/t2v-standard",         "name": "Hailuo 2.3 Standard · T2V",     "type": "Video", "supports_image": False},
    {"id": "minimax/hailuo-2.3/i2v-pro",              "name": "Hailuo 2.3 Pro · I2V",          "type": "Video", "supports_image": True},
    {"id": "minimax/hailuo-2.3/i2v-standard",         "name": "Hailuo 2.3 Standard · I2V",     "type": "Video", "supports_image": True},
]

# Build allowlist map: id -> model dict (with supported_params)
def _get_supported_params(mtype: str, mid: str) -> list:
    ml = mid.lower()
    p = ["aspect_ratio"]

    if mtype == "Video":
        p.append("duration")
        if "kling" in ml or "kwaivgi" in ml:
            p += ["generate_audio", "negative_prompt"]
        elif "minimax" in ml or "hailuo" in ml:
            p += ["resolution"]
        elif "seedance" in ml or "bytedance" in ml:
            p += ["resolution", "output_format", "generate_audio", "watermark", "return_last_frame"]
        elif "wan" in ml or "alibaba" in ml:
            p += ["resolution", "seed"]
        return p

    # Image models
    if "youchuan" in ml:
        p += ["hd", "stylize", "chaos", "weird", "output_quality", "seed", "sref"]
        return p
    if "gpt" in ml or "openai" in ml:
        p += ["output_quality", "output_format"]  # size mapped separately, not resolution
        return p
    if "nano-banana" in ml:
        p += ["resolution", "thinking_level", "media_resolution", "output_format"]
        return p
    if "wan" in ml or "alibaba" in ml:
        p += ["negative_prompt", "seed", "guidance_scale"]
        return p
    # Fallback
    p += ["negative_prompt", "seed", "num_outputs", "output_format", "output_quality", "guidance_scale", "num_inference_steps"]
    return p


MODEL_MAP: dict[str, dict] = {}
for _m in _CATALOGUE:
    _mc = dict(_m)
    _mc["supported_params"] = _get_supported_params(_m["type"], _m["id"])
    MODEL_MAP[_m["id"]] = _mc


def _headers():
    return {"Authorization": f"Bearer {ATLAS_API_KEY}", "Content-Type": "application/json"}


@router.get("/models")
async def get_models():
    """Return curated model catalogue."""
    return {"models": list(MODEL_MAP.values())}


@router.get("/models/{model_id:path}")
async def get_model_details(model_id: str):
    """Return model info from local catalogue (no live fetch needed)."""
    if model_id in MODEL_MAP:
        return {"model": MODEL_MAP[model_id]}
    raise HTTPException(status_code=404, detail=f"Model '{model_id}' not found in catalogue")


@router.get("/status/{prediction_id}")
async def get_generation_status(prediction_id: str):
    """Poll Atlas Cloud for prediction status and return result URL when ready."""
    if not ATLAS_API_KEY:
        # Mock response for local dev
        return {"status": "completed", "output": None, "prediction_id": prediction_id}
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                f"{ATLAS_BASE_URL}/model/status/{prediction_id}",
                headers=_headers()
            )
            if r.status_code == 200:
                data = r.json()
                # Normalize Atlas status response
                status = data.get("status", "processing")
                output_url = (
                    data.get("output") or
                    data.get("output_url") or
                    data.get("result") or
                    data.get("url") or
                    data.get("video_url") or
                    data.get("image_url")
                )
                # Handle list outputs
                if isinstance(output_url, list) and output_url:
                    output_url = output_url[0]
                return {
                    "status": status,
                    "output": output_url,
                    "prediction_id": prediction_id,
                    "raw": data
                }
            else:
                logger.warning(f"Status poll returned {r.status_code} for {prediction_id}: {r.text[:200]}")
                return {"status": "processing", "output": None, "prediction_id": prediction_id}
    except Exception:
        logger.exception(f"Status poll failed for {prediction_id}")
        return {"status": "processing", "output": None, "prediction_id": prediction_id}


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
    generate_audio: Optional[str] = Form(None),
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
    """Submit generation task to Atlas Cloud REST API.
    
    Flow:
      1. Validate model against allowlist
      2. Validate type matches model type
      3. Validate + upload reference file (no Base64 fallback)
      4. Build payload using ONLY supported_params for the model
      5. Submit to Atlas, return prediction_id for polling
    """
    # ── 1. Validate model ────────────────────────────────────────────────────
    if model_keyword not in MODEL_MAP:
        raise HTTPException(status_code=400, detail=f"Unsupported model: '{model_keyword}'. Use /api/atlas/models to see available models.")

    model_info = MODEL_MAP[model_keyword]

    # ── 2. Validate type matches ─────────────────────────────────────────────
    if model_info["type"] != type:
        raise HTTPException(
            status_code=400,
            detail=f"Type mismatch: model '{model_keyword}' is a {model_info['type']} model, but type='{type}' was requested."
        )

    supported = set(model_info["supported_params"])
    mid_low = model_keyword.lower()

    # ── 3. Reference file validation and upload ──────────────────────────────
    image_url_for_payload: Optional[str] = None
    raw_bytes: Optional[bytes] = None

    if reference_file:
        if not model_info.get("supports_image", False):
            raise HTTPException(status_code=400, detail=f"Model '{model_keyword}' does not support a reference file.")

        ct = reference_file.content_type or ""
        if not (ct.startswith("image/") or ct.startswith("video/")):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images or videos are allowed.")

        raw_bytes = await reference_file.read()
        if len(raw_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Reference file exceeds the 10MB limit.")

    # ── Mock mode (no API key) ───────────────────────────────────────────────
    prediction_id = f"pred_{uuid.uuid4().hex[:12]}"
    if not ATLAS_API_KEY:
        return {
            "status": "success",
            "prediction_id": prediction_id,
            "message": f"[Mock] {type} task submitted — set ATLAS_API_KEY to use real generation.",
            "prompt_used": prompt,
            "model": model_keyword,
        }

    try:
        async with httpx.AsyncClient(timeout=120) as client:
            # Upload reference file if provided
            if raw_bytes is not None:
                upload_res = await client.post(
                    f"{ATLAS_BASE_URL}/model/uploadMedia",
                    headers={"Authorization": f"Bearer {ATLAS_API_KEY}"},
                    files={"file": (reference_file.filename, raw_bytes, reference_file.content_type)}
                )
                if upload_res.status_code not in (200, 201):
                    logger.error(
                        f"Media upload failed for model={model_keyword} "
                        f"status={upload_res.status_code} body={upload_res.text[:300]}"
                    )
                    raise HTTPException(
                        status_code=502,
                        detail="Failed to upload reference file to Atlas Cloud. Please try again."
                    )
                upload_data = upload_res.json()
                image_url_for_payload = (
                    upload_data.get("url") or
                    upload_data.get("media_url") or
                    upload_data.get("image_url")
                )
                if not image_url_for_payload:
                    logger.error(f"Atlas upload succeeded but no URL found: {upload_data}")
                    raise HTTPException(status_code=502, detail="Atlas returned no URL after upload.")

            # ── 4. Build payload with ONLY supported params ──────────────────
            payload: dict = {
                "model": model_keyword,
                "prompt": prompt,
            }

            # aspect_ratio / ratio key differs by provider
            if "aspect_ratio" in supported:
                if "minimax" in mid_low or "hailuo" in mid_low or "seedance" in mid_low or "bytedance" in mid_low:
                    payload["ratio"] = aspect_ratio
                else:
                    payload["aspect_ratio"] = aspect_ratio

            # duration (Video only)
            if type == "Video" and "duration" in supported:
                try:
                    payload["duration"] = int(str(duration).replace("s", "").strip())
                except ValueError:
                    payload["duration"] = 5

            # reference image
            if image_url_for_payload:
                payload["image"] = image_url_for_payload
                payload["image_url"] = image_url_for_payload

            def _bool(v: Optional[str]) -> Optional[bool]:
                if v is None:
                    return None
                return v.lower() in ("true", "1", "yes")

            # Map each Form param → payload only if in supported_params
            if "negative_prompt"      in supported and negative_prompt:      payload["negative_prompt"]      = negative_prompt
            if "num_outputs"          in supported and num_outputs:           payload["num_outputs"]           = num_outputs
            if "output_format"        in supported and output_format:         payload["output_format"]         = output_format
            if "output_quality"       in supported and output_quality:        payload["output_quality"]        = output_quality
            if "guidance_scale"       in supported and guidance_scale:        payload["guidance_scale"]        = guidance_scale
            if "num_inference_steps"  in supported and num_inference_steps:   payload["num_inference_steps"]   = num_inference_steps
            if "seed"                 in supported and seed is not None:      payload["seed"]                  = seed
            if "stylize"              in supported and stylize is not None:   payload["stylize"]               = stylize
            if "chaos"                in supported and chaos is not None:     payload["chaos"]                 = chaos
            if "weird"                in supported and weird is not None:     payload["weird"]                 = weird
            if "sref"                 in supported and sref:                  payload["sref"]                  = sref
            if "thinking_level"       in supported and thinking_level:        payload["thinking_level"]        = thinking_level
            if "media_resolution"     in supported and media_resolution:      payload["media_resolution"]      = media_resolution

            if "hd" in supported:
                hd_val = _bool(hd)
                if hd_val is not None:
                    payload["hd"] = hd_val

            if "watermark" in supported:
                wm_val = _bool(watermark)
                if wm_val is not None:
                    payload["watermark"] = wm_val

            if "return_last_frame" in supported:
                rlf_val = _bool(return_last_frame)
                if rlf_val is not None:
                    payload["return_last_frame"] = rlf_val

            if "generate_audio" in supported:
                ga_val = _bool(generate_audio)
                if ga_val is not None:
                    payload["generate_audio"] = ga_val
                    if "kling" in mid_low or "kwaivgi" in mid_low:
                        payload["sound"] = ga_val

            # Resolution mapping
            if "resolution" in supported and resolution:
                if "gpt" in mid_low or "openai" in mid_low:
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

            # ── 5. Submit to Atlas ────────────────────────────────────────────
            endpoint = "/model/generateVideo" if type == "Video" else "/model/generateImage"

            logger.info(f"Atlas generate request: model={model_keyword} endpoint={endpoint} params={list(payload.keys())}")

            r = await client.post(
                f"{ATLAS_BASE_URL}{endpoint}",
                headers=_headers(),
                json=payload
            )

            if r.status_code in (200, 201):
                data = r.json()
                atlas_id = data.get("id") or data.get("prediction_id") or prediction_id
                logger.info(f"Atlas accepted generation: atlas_id={atlas_id} model={model_keyword}")
                return {
                    "status": "success",
                    "prediction_id": atlas_id,
                    "message": f"{type} generation submitted to Atlas Cloud.",
                    "prompt_used": prompt,
                    "model": model_keyword,
                    "model_name": model_info["name"],
                }
            else:
                # Parse Atlas error for logging
                try:
                    atlas_err = r.json()
                    err_detail = atlas_err.get("error") or atlas_err.get("message") or atlas_err.get("detail") or r.text[:200]
                except Exception:
                    err_detail = r.text[:200]

                logger.error(
                    f"Atlas generation failed: model={model_keyword} endpoint={endpoint} "
                    f"status={r.status_code} error={err_detail} payload_keys={list(payload.keys())}"
                )
                raise HTTPException(
                    status_code=r.status_code,
                    detail=f"Generation failed: {err_detail}"
                )

    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Unexpected error during generation: model={model_keyword}")
        raise HTTPException(status_code=500, detail="Internal server error during generation.")
