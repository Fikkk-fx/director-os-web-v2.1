from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Request
from typing import Optional
import uuid
import os
import httpx
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()

# Fixed ATLAS base URL
ATLAS_BASE_URL = "https://api.atlascloud.ai/api/v1"
ATLAS_API_KEY = os.getenv("ATLAS_API_KEY", "")

# ─────────────────────────────────────────────────────────────────────────────
# EXACT CURATED MODEL CATALOGUE — verified against Atlas Cloud API (?tab=api)
# Providers use Atlas canonical names: OPENAI, GOOGLE, BLACK-FOREST-LABS,
# QWEN (Wan/Alibaba), MIDJOURNEY (Youchuan), BYTEDANCE, MINIMAX, KUAISHOU
# ─────────────────────────────────────────────────────────────────────────────
_CATALOGUE = [
    # ── Image: OpenAI GPT Image 2 ───────────────────────────────────────────
    {"id": "openai/gpt-image-2/text-to-image",          "provider": "OpenAI",       "name": "GPT Image 2",              "type": "Image", "mode": "text-to-image",      "supports_image": False},
    {"id": "openai/gpt-image-2/edit",                   "provider": "OpenAI",       "name": "GPT Image 2 Edit",         "type": "Image", "mode": "edit",             "supports_image": True},
    # ── Image: Google Nano Banana 2 ─────────────────────────────────────────
    {"id": "google/nano-banana-2/text-to-image",        "provider": "Google",       "name": "Nano Banana 2",            "type": "Image", "mode": "text-to-image",      "supports_image": False},
    {"id": "google/nano-banana-2/edit",                 "provider": "Google",       "name": "Nano Banana 2 Edit",       "type": "Image", "mode": "edit",             "supports_image": True},
    # ── Image: Black Forest Labs FLUX ────────────────────────────────────────
    {"id": "black-forest-labs/flux-2-pro/text-to-image","provider": "FLUX",         "name": "FLUX.2 Pro",               "type": "Image", "mode": "text-to-image",      "supports_image": False},
    {"id": "black-forest-labs/flux-2-flex/text-to-image","provider": "FLUX",        "name": "FLUX.2 Flex",              "type": "Image", "mode": "text-to-image",      "supports_image": False},
    {"id": "black-forest-labs/flux-dev",                "provider": "FLUX",         "name": "FLUX Dev",                 "type": "Image", "mode": "text-to-image",      "supports_image": False},
    {"id": "black-forest-labs/flux-schnell",            "provider": "FLUX",         "name": "FLUX Schnell",             "type": "Image", "mode": "text-to-image",      "supports_image": False},
    # ── Image: Alibaba Wan 2.7 ──────────────────────────────────────────────
    {"id": "alibaba/wan-2.7/text-to-image",             "provider": "Wan",          "name": "Wan 2.7",                  "type": "Image", "mode": "text-to-image",      "supports_image": False},
    {"id": "alibaba/wan-2.7/image-edit",                "provider": "Wan",          "name": "Wan 2.7 Edit",             "type": "Image", "mode": "edit",             "supports_image": True},
    # ── Image: Midjourney (Youchuan v8.2) ────────────────────────────────────
    {"id": "youchuan/v8.2/text-to-image",               "provider": "Midjourney",   "name": "Midjourney V8.2",          "type": "Image", "mode": "text-to-image",      "supports_image": False},

    # ── Video: ByteDance Seedance 2.5 ────────────────────────────────────────
    {"id": "bytedance/seedance-2.5/text-to-video",      "provider": "ByteDance",    "name": "Seedance 2.5 T2V",         "type": "Video", "mode": "text-to-video",      "supports_image": False},
    {"id": "bytedance/seedance-2.5/image-to-video",     "provider": "ByteDance",    "name": "Seedance 2.5 I2V",         "type": "Video", "mode": "image-to-video",     "supports_image": True},
    {"id": "bytedance/seedance-2.5/reference-to-video", "provider": "ByteDance",    "name": "Seedance 2.5 Ref2V",       "type": "Video", "mode": "reference-to-video", "supports_image": True},
    # ── Video: ByteDance Seedance 2.0 ────────────────────────────────────────
    {"id": "bytedance/seedance-2.0/text-to-video",      "provider": "ByteDance",    "name": "Seedance 2.0 T2V",         "type": "Video", "mode": "text-to-video",      "supports_image": False},
    {"id": "bytedance/seedance-2.0/image-to-video",     "provider": "ByteDance",    "name": "Seedance 2.0 I2V",         "type": "Video", "mode": "image-to-video",     "supports_image": True},
    # ── Video: MiniMax H3 ────────────────────────────────────────────────────
    {"id": "minimax/h3/text-to-video",                  "provider": "MiniMax",      "name": "MiniMax H3 T2V",           "type": "Video", "mode": "text-to-video",      "supports_image": False},
    {"id": "minimax/h3/image-to-video",                 "provider": "MiniMax",      "name": "MiniMax H3 I2V",           "type": "Video", "mode": "image-to-video",     "supports_image": True},
    {"id": "minimax/h3/reference-to-video",             "provider": "MiniMax",      "name": "MiniMax H3 Ref2V",         "type": "Video", "mode": "reference-to-video", "supports_image": True},
    # ── Video: Kuaishou Kling V3.0 ───────────────────────────────────────────
    {"id": "kwaivgi/kling-v3.0-turbo/text-to-video",   "provider": "Kling",        "name": "Kling V3.0 Turbo T2V",    "type": "Video", "mode": "text-to-video",      "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-turbo/image-to-video",  "provider": "Kling",        "name": "Kling V3.0 Turbo I2V",    "type": "Video", "mode": "image-to-video",     "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-pro/text-to-video",     "provider": "Kling",        "name": "Kling V3.0 Pro T2V",      "type": "Video", "mode": "text-to-video",      "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-pro/image-to-video",    "provider": "Kling",        "name": "Kling V3.0 Pro I2V",      "type": "Video", "mode": "image-to-video",     "supports_image": True},
    # ── Video: Alibaba Wan 2.7 ───────────────────────────────────────────────
    {"id": "alibaba/wan-2.7/text-to-video",             "provider": "Wan",          "name": "Wan 2.7 T2V",              "type": "Video", "mode": "text-to-video",      "supports_image": False},
    {"id": "alibaba/wan-2.7/image-to-video",            "provider": "Wan",          "name": "Wan 2.7 I2V",              "type": "Video", "mode": "image-to-video",     "supports_image": True},
    {"id": "alibaba/wan-2.7/reference-to-video",        "provider": "Wan",          "name": "Wan 2.7 Ref2V",            "type": "Video", "mode": "reference-to-video", "supports_image": True},
    # ── Video: Google Veo 3.1 ────────────────────────────────────────────────
    {"id": "google/veo3.1/text-to-video",               "provider": "Google",       "name": "Veo 3.1 T2V",              "type": "Video", "mode": "text-to-video",      "supports_image": False},
    {"id": "google/veo3.1/image-to-video",              "provider": "Google",       "name": "Veo 3.1 I2V",              "type": "Video", "mode": "image-to-video",     "supports_image": True},
    # ── Video: Midjourney (Youchuan v8.2 I2V) ───────────────────────────────
    {"id": "youchuan/v8.2/image-to-video",              "provider": "Midjourney",   "name": "Midjourney V8.2 I2V",     "type": "Video", "mode": "image-to-video",     "supports_image": True},
]

# Static supported-params schema — verified against Atlas ?tab=api reference
def _get_supported_params(provider: str, type: str) -> list:
    if type == "Video":
        if provider == "ByteDance":
            return ["aspect_ratio", "duration", "resolution", "generate_audio", "watermark"]
        if provider == "MiniMax":
            return ["aspect_ratio", "duration", "resolution", "generate_audio"]
        if provider == "Kling":
            return ["aspect_ratio", "duration", "resolution", "negative_prompt", "cfg_scale"]
        if provider == "Wan":
            return ["aspect_ratio", "duration", "resolution", "negative_prompt", "generate_audio"]
        if provider == "Google":
            return ["aspect_ratio", "duration", "resolution"]
        if provider == "Midjourney":
            return ["aspect_ratio", "duration", "resolution"]
        return ["aspect_ratio", "duration"]

    if type == "Image":
        if provider == "OpenAI":
            return ["size", "num_outputs", "output_quality", "output_format"]
        if provider == "Google":
            return ["aspect_ratio", "resolution", "thinking_level", "output_format"]
        if provider == "FLUX":
            return ["size", "output_format", "seed", "safety_tolerance"]
        if provider == "Wan":
            return ["aspect_ratio", "negative_prompt", "seed", "guidance_scale"]
        if provider == "Midjourney":
            return ["aspect_ratio", "hd", "stylize", "chaos", "weird", "seed", "sref"]
        return ["aspect_ratio"]


MODEL_MAP: dict[str, dict] = {}
for _m in _CATALOGUE:
    _mc = dict(_m)
    _mc["supported_params"] = _get_supported_params(_m["provider"], _m["type"])
    MODEL_MAP[_m["id"]] = _mc


def _headers():
    return {"Authorization": f"Bearer {ATLAS_API_KEY}", "Content-Type": "application/json"}


@router.get("/models")
async def get_models():
    """Return curated model catalogue with providers."""
    return {"models": list(MODEL_MAP.values())}


@router.get("/models/{model_id:path}")
async def get_model_details(model_id: str):
    """Return model info from local catalogue."""
    if model_id in MODEL_MAP:
        return {"model": MODEL_MAP[model_id]}
    raise HTTPException(status_code=404, detail=f"Model '{model_id}' not found in catalogue")


@router.get("/status/{prediction_id}")
@limiter.limit("30/minute")
async def get_generation_status(request: Request, prediction_id: str):
    """Poll Atlas Cloud for prediction status and return result URL when ready."""
    if not ATLAS_API_KEY:
        # Mock response for local dev
        return {"status": "completed", "output": None, "prediction_id": prediction_id}
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # FIXED: Use /model/prediction endpoint
            r = await client.get(
                f"{ATLAS_BASE_URL}/model/prediction/{prediction_id}",
                headers=_headers()
            )
            if r.status_code == 200:
                resp_json = r.json()
                # FIXED: Parse from "data" object
                data = resp_json.get("data", {})
                status = data.get("status", "processing")
                outputs = data.get("outputs", [])
                
                output_url = None
                if isinstance(outputs, list) and len(outputs) > 0:
                    output_url = outputs[0]
                elif isinstance(outputs, str):
                    output_url = outputs
                
                # Fallback if outputs is empty but it's completed
                if status == "completed" and not output_url:
                    output_url = data.get("output") or data.get("url")

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
    if model_keyword not in MODEL_MAP:
        raise HTTPException(status_code=400, detail=f"Unsupported model: '{model_keyword}'. Use /api/atlas/models to see available models.")

    model_info = MODEL_MAP[model_keyword]

    if model_info["type"] != type:
        raise HTTPException(
            status_code=400,
            detail=f"Type mismatch: model '{model_keyword}' is a {model_info['type']} model, but type='{type}' was requested."
        )

    supported = set(model_info["supported_params"])

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
            if raw_bytes is not None:
                # FIXED: Endpoint URL
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
                upload_json = upload_res.json()
                
                # FIXED: Parse data.download_url
                data_obj = upload_json.get("data", {})
                image_url_for_payload = (
                    data_obj.get("download_url") or
                    data_obj.get("url") or
                    upload_json.get("url")
                )
                if not image_url_for_payload:
                    logger.error(f"Atlas upload succeeded but no download_url found: {upload_json}")
                    raise HTTPException(status_code=502, detail="Atlas returned no URL after upload.")

            payload: dict = {
                "model": model_keyword,
                "prompt": prompt,
            }

            if "aspect_ratio" in supported:
                payload["aspect_ratio"] = aspect_ratio

            if type == "Video" and "duration" in supported:
                try:
                    payload["duration"] = int(str(duration).replace("s", "").strip())
                except ValueError:
                    payload["duration"] = 5

            if image_url_for_payload:
                payload["image"] = image_url_for_payload
                payload["image_url"] = image_url_for_payload

            def _bool(v: Optional[str]) -> Optional[bool]:
                if v is None:
                    return None
                return v.lower() in ("true", "1", "yes")

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

            # cfg_scale for Kling video models
            if "cfg_scale" in supported and guidance_scale is not None:
                payload["cfg_scale"] = guidance_scale

            # quality param for Midjourney
            if "quality" in supported and output_quality is not None:
                payload["quality"] = output_quality

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
                    if model_info["provider"] == "Kling":
                        payload["sound"] = ga_val

            if resolution:
                if "size" in supported and model_info["provider"] == "OpenAI":
                    size_map = {
                        "720p":  "1024x768",
                        "1080p": "1024x1024",
                        "1440p": "1536x1024",
                        "2k":    "1536x1024",
                        "4k":    "2048x1152",
                    }
                    payload["size"] = size_map.get(resolution.lower(), "1024x1024")
                elif "resolution" in supported:
                    payload["resolution"] = resolution

            # FIXED: Endpoint URL
            endpoint = "/model/generateVideo" if type == "Video" else "/model/generateImage"

            logger.info(f"Atlas generate request: model={model_keyword} endpoint={endpoint} params={list(payload.keys())}")

            r = await client.post(
                f"{ATLAS_BASE_URL}{endpoint}",
                headers=_headers(),
                json=payload
            )

            if r.status_code in (200, 201):
                resp_json = r.json()
                # FIXED: Parse data object if wrapped
                data = resp_json.get("data", resp_json)
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
                try:
                    atlas_err = r.json()
                    err_data = atlas_err.get("error", atlas_err)
                    err_detail = err_data.get("message") or err_data.get("detail") or r.text[:200]
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
