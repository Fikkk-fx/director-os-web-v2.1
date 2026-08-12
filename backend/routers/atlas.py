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

ATLAS_BASE_URL = "https://api.atlascloud.ai/api/v1"
ATLAS_API_KEY = os.getenv("ATLAS_API_KEY", "")

# ─────────────────────────────────────────────────────────────────────────────
# PER-MODEL PARAM GROUPS — verified via atlas_get_model_info MCP, 2026-08-12
# ─────────────────────────────────────────────────────────────────────────────
#
# Key notes on API field names:
#   ByteDance video  → uses "ratio" (not aspect_ratio), "resolution", "generate_audio"
#   ByteDance image  → uses "size" format "WIDTHxHEIGHT" (e.g. "2048*2048"), "output_format"
#   Wan video        → uses "ratio", "resolution", "seed"
#   Wan image        → uses "size" ("1K"/"2K"), "seed"
#   Kling video      → uses "aspect_ratio", "sound" (not generate_audio), "cfg_scale"
#   MiniMax video    → uses "ratio", "resolution" (REQUIRED), "duration"
#   Google Veo       → uses "aspect_ratio", "duration", "resolution", "generate_audio", "seed"
#   Google Nano      → uses "aspect_ratio", "resolution", "thinking_level", "media_resolution"
#   Google Imagen4   → uses "aspect_ratio", "resolution" ("1k"/"2k"), "negative_prompt", "seed"
#   Gemini Omni      → uses "aspect_ratio", "duration", "thinking_level", "resolution", "seed"
#   OpenAI image     → uses "size" (WIDTHxHEIGHT), "quality" (str low/med/high), "output_format"
#   FLUX image       → uses "size" ("1024*1024" format), "output_format", "seed"
#   Youchuan image   → uses "aspect_ratio", "hd", "stylize", "chaos", "weird", "sref", "quality"(1/4), "seed"
#   Youchuan video   → minimal params (resolution only from API)
#   HappyHorse video → uses "ratio", "resolution", "duration", "seed"

def _p(*params):
    return list(params)

# Param group definitions
_BD_VIDEO   = _p("ratio", "duration", "resolution", "generate_audio", "watermark", "return_last_frame", "output_format")
_BD_IMAGE   = _p("size", "output_format", "negative_prompt")        # Seedream: size format "W*H"
_WAN_VIDEO  = _p("ratio", "duration", "resolution", "seed", "negative_prompt")
_WAN_IMAGE  = _p("size", "seed", "negative_prompt")                 # size = "1K"/"2K"
_HAPPY_VID  = _p("ratio", "resolution", "duration", "seed")         # HappyHorse
_KLING_VID  = _p("aspect_ratio", "duration", "sound", "negative_prompt", "cfg_scale")
_MINIMAX_V  = _p("ratio", "resolution", "duration")                 # resolution REQUIRED
_VEO_VIDEO  = _p("aspect_ratio", "duration", "resolution", "generate_audio", "seed", "negative_prompt")
_GEMINI_VID = _p("aspect_ratio", "duration", "thinking_level", "resolution", "seed")
_NANO_IMG   = _p("aspect_ratio", "resolution", "thinking_level", "media_resolution", "output_format")
_IMAGEN_IMG = _p("aspect_ratio", "resolution", "negative_prompt", "seed")
_OPENAI_IMG = _p("size", "quality", "output_format")
_FLUX_IMG   = _p("size", "output_format", "seed")
_YOU_IMG    = _p("aspect_ratio", "hd", "stylize", "chaos", "weird", "sref", "quality_mj", "seed")
_MID_VID    = _p("resolution")
_BASIC_VID  = _p("aspect_ratio", "duration")
_BASIC_IMG  = _p("aspect_ratio")

# ─────────────────────────────────────────────────────────────────────────────
# CATALOGUE — id, provider, name, type, mode, supports_image, supported_params
# ─────────────────────────────────────────────────────────────────────────────
_CATALOGUE = [
    # ── IMAGE ──────────────────────────────────────────────────────────────
    # ByteDance Seedream (image)
    {"id": "bytedance/seedream-v5.0-pro/text-to-image",       "provider": "ByteDance", "name": "Seedream v5.0 Pro Text-to-Image",          "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _BD_IMAGE},
    {"id": "bytedance/seedream-v5.0-pro/edit",                "provider": "ByteDance", "name": "Seedream v5.0 Pro Edit",                   "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _BD_IMAGE},
    {"id": "bytedance/seedream-v5.0-lite",                    "provider": "ByteDance", "name": "Seedream v5.0 Lite",                       "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _BD_IMAGE},
    {"id": "bytedance/seedream-v5.0-lite/edit",               "provider": "ByteDance", "name": "Seedream v5.0 Lite Edit",                  "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _BD_IMAGE},
    {"id": "bytedance/seedream-v4.5",                         "provider": "ByteDance", "name": "Seedream v4.5",                            "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _BD_IMAGE},
    {"id": "bytedance/seedream-v4.5/edit",                    "provider": "ByteDance", "name": "Seedream v4.5 Edit",                       "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _BD_IMAGE},
    {"id": "bytedance/seedream-v4",                           "provider": "ByteDance", "name": "Seedream v4",                              "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _BD_IMAGE},
    {"id": "bytedance/seedream-v4/edit",                      "provider": "ByteDance", "name": "Seedream v4 Edit",                         "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _BD_IMAGE},
    {"id": "bytedance/seed3d-v2.0/image-to-3d",               "provider": "ByteDance", "name": "Seed3D 2.0 Image-to-3D",                   "type": "Image", "mode": "image-to-image",   "supports_image": True,  "supported_params": _BASIC_IMG},
    {"id": "bytedance/seedream-v5.0-pro/layer-decomposition",  "provider": "ByteDance", "name": "Seedream v5.0 Pro Layer Decomposition",    "type": "Image", "mode": "other",            "supports_image": True,  "supported_params": _BD_IMAGE},
    # OpenAI (image)
    {"id": "openai/gpt-image-2/text-to-image",                "provider": "OpenAI", "name": "GPT Image 2 Text-to-Image",                   "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _OPENAI_IMG},
    {"id": "openai/gpt-image-2/edit",                         "provider": "OpenAI", "name": "GPT Image 2 Edit",                            "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _OPENAI_IMG},
    {"id": "openai/gpt-image-2-developer/text-to-image",      "provider": "OpenAI", "name": "GPT Image 2 Developer Text-to-Image",         "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _OPENAI_IMG},
    {"id": "openai/gpt-image-2-developer/edit",               "provider": "OpenAI", "name": "GPT Image 2 Developer Edit",                  "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _OPENAI_IMG},
    {"id": "openai/gpt-image-1.5/text-to-image",              "provider": "OpenAI", "name": "GPT Image-1.5 Text-to-image",                 "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _OPENAI_IMG},
    {"id": "openai/gpt-image-1.5/edit",                       "provider": "OpenAI", "name": "GPT Image-1.5 Edit",                         "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _OPENAI_IMG},
    {"id": "openai/gpt-image-1/text-to-image",                "provider": "OpenAI", "name": "GPT Image-1 Text-to-image",                   "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _OPENAI_IMG},
    {"id": "openai/gpt-image-1/edit",                         "provider": "OpenAI", "name": "GPT Image-1 Edit",                           "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _OPENAI_IMG},
    {"id": "openai/gpt-image-1-mini/text-to-image",           "provider": "OpenAI", "name": "GPT Image-1 Mini Text-to-image",              "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _OPENAI_IMG},
    {"id": "openai/gpt-image-1-mini/edit",                    "provider": "OpenAI", "name": "GPT Image-1 Mini Edit",                      "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _OPENAI_IMG},
    # FLUX (image)
    {"id": "black-forest-labs/flux-2-pro/text-to-image",      "provider": "FLUX", "name": "FLUX.2 Pro Text-to-image",                     "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _FLUX_IMG},
    {"id": "black-forest-labs/flux-2-pro/edit",               "provider": "FLUX", "name": "FLUX.2 Pro Edit",                              "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _FLUX_IMG},
    {"id": "black-forest-labs/flux-2-flex/text-to-image",     "provider": "FLUX", "name": "FLUX.2 Flex Text-to-image",                    "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _FLUX_IMG},
    {"id": "black-forest-labs/flux-2-flex/edit",              "provider": "FLUX", "name": "FLUX.2 Flex Edit",                             "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _FLUX_IMG},
    {"id": "black-forest-labs/flux-dev",                      "provider": "FLUX", "name": "Flux Dev",                                     "type": "Image", "mode": "text-to-image",    "supports_image": True,  "supported_params": _FLUX_IMG},
    {"id": "black-forest-labs/flux-dev-lora",                 "provider": "FLUX", "name": "Flux Dev Lora",                                "type": "Image", "mode": "text-to-image",    "supports_image": True,  "supported_params": _FLUX_IMG},
    {"id": "black-forest-labs/flux-schnell",                  "provider": "FLUX", "name": "Flux Schnell",                                 "type": "Image", "mode": "text-to-image",    "supports_image": True,  "supported_params": _FLUX_IMG},
    {"id": "black-forest-labs/flux-kontext-dev",              "provider": "FLUX", "name": "Flux Kontext Dev",                             "type": "Image", "mode": "text-to-image",    "supports_image": True,  "supported_params": _FLUX_IMG},
    {"id": "black-forest-labs/flux-kontext-dev-lora",         "provider": "FLUX", "name": "Flux Kontext Dev Lora",                        "type": "Image", "mode": "text-to-image",    "supports_image": True,  "supported_params": _FLUX_IMG},
    # Wan / Alibaba / Qwen (image)
    {"id": "alibaba/wan-2.7/text-to-image",                   "provider": "Wan", "name": "Wan-2.7 Text-to-image",                        "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _WAN_IMAGE},
    {"id": "alibaba/wan-2.7/image-edit",                      "provider": "Wan", "name": "Wan-2.7 Image Edit",                           "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    {"id": "alibaba/wan-2.7-pro/text-to-image",               "provider": "Wan", "name": "Wan-2.7 Pro Text-to-image",                    "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _WAN_IMAGE},
    {"id": "alibaba/wan-2.7-pro/image-edit",                  "provider": "Wan", "name": "Wan-2.7 Pro Image Edit",                       "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    {"id": "alibaba/wan-2.6/text-to-image",                   "provider": "Wan", "name": "Wan-2.6 Text-to-image",                        "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _WAN_IMAGE},
    {"id": "alibaba/wan-2.6/image-edit",                      "provider": "Wan", "name": "Wan-2.6 Image Edit",                           "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    {"id": "alibaba/wan-2.5/text-to-image",                   "provider": "Wan", "name": "Wan-2.5 Text-to-image",                        "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _WAN_IMAGE},
    {"id": "alibaba/wan-2.5/image-edit",                      "provider": "Wan", "name": "Wan-2.5 Image Edit",                           "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    {"id": "qwen-image-3.0/text-to-image",                    "provider": "Wan", "name": "Qwen Image 3.0 Text-to-Image",                 "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _WAN_IMAGE},
    {"id": "qwen-image-3.0/edit",                             "provider": "Wan", "name": "Qwen Image 3.0 Edit",                         "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    {"id": "qwen/qwen-image-2.0/text-to-image",               "provider": "Wan", "name": "Qwen Image 2.0 Text-to-image",                 "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _WAN_IMAGE},
    {"id": "qwen/qwen-image-2.0/edit",                        "provider": "Wan", "name": "Qwen Image 2.0 Edit",                         "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    {"id": "qwen/qwen-image-2.0-pro/text-to-image",           "provider": "Wan", "name": "Qwen Image 2.0 Pro Text-to-image",             "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _WAN_IMAGE},
    {"id": "qwen/qwen-image-2.0-pro/edit",                    "provider": "Wan", "name": "Qwen Image 2.0 Pro Edit",                     "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    {"id": "alibaba/qwen-image/text-to-image-max",            "provider": "Wan", "name": "Qwen-Image Text-to-image Max",                 "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _WAN_IMAGE},
    {"id": "alibaba/qwen-image/text-to-image-plus",           "provider": "Wan", "name": "Qwen-Image Text-to-image Plus",                "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _WAN_IMAGE},
    {"id": "alibaba/qwen-image/edit",                         "provider": "Wan", "name": "Qwen-Image Edit",                             "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    {"id": "alibaba/qwen-image/edit-plus",                    "provider": "Wan", "name": "Qwen-Image Edit Plus",                        "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    {"id": "alibaba/qwen-image/edit-plus-20251215",            "provider": "Wan", "name": "Qwen-Image Edit Plus 20251215",               "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    {"id": "atlascloud/qwen-image/text-to-image",             "provider": "Wan", "name": "Qwen Image Text-to-image",                    "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _WAN_IMAGE},
    {"id": "atlascloud/qwen-image/edit",                      "provider": "Wan", "name": "Qwen Image Edit",                             "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_IMAGE},
    # Google Imagen (image) — aspect_ratio + resolution ("1k"/"2k") + negative_prompt + seed
    {"id": "google/imagen4",                                   "provider": "Google", "name": "Imagen4",                                  "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _IMAGEN_IMG},
    {"id": "google/imagen4-ultra",                             "provider": "Google", "name": "Imagen4 Ultra",                            "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _IMAGEN_IMG},
    {"id": "google/imagen4-fast",                              "provider": "Google", "name": "Imagen4 Fast",                             "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _IMAGEN_IMG},
    {"id": "google/imagen3",                                   "provider": "Google", "name": "Imagen3",                                  "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _IMAGEN_IMG},
    {"id": "google/imagen3-fast",                              "provider": "Google", "name": "Imagen3 Fast",                             "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _IMAGEN_IMG},
    # Google Nano Banana (image) — aspect_ratio + resolution + thinking_level + media_resolution
    {"id": "google/nano-banana-2/text-to-image",              "provider": "Google", "name": "Nano Banana 2 Text-to-Image",               "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-2/edit",                       "provider": "Google", "name": "Nano Banana 2 Edit",                        "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-2/reference-to-image",         "provider": "Google", "name": "Nano Banana 2 Reference-to-image",          "type": "Image", "mode": "reference-to-image","supports_image": True, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-2/text-to-image-developer",    "provider": "Google", "name": "Nano Banana 2 Text-to-Image Developer",     "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-2/edit-developer",             "provider": "Google", "name": "Nano Banana 2 Edit Developer",              "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-2/reference-to-image-developer","provider": "Google", "name": "Nano Banana 2 Reference-to-image Developer","type": "Image","mode": "reference-to-image","supports_image": True,  "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-2-lite/text-to-image",         "provider": "Google", "name": "Nano Banana 2 Lite Text-to-image",          "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-2-lite/edit",                  "provider": "Google", "name": "Nano Banana 2 Lite Edit",                   "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-2-lite/text-to-image-developer","provider": "Google", "name": "Nano Banana 2 Lite T2I Developer",         "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-2-lite/edit-developer",        "provider": "Google", "name": "Nano Banana 2 Lite Edit Developer",         "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-2-lite/reference-to-image",    "provider": "Google", "name": "Nano Banana 2 Lite Reference-to-image",     "type": "Image", "mode": "reference-to-image","supports_image": True, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-pro/text-to-image",            "provider": "Google", "name": "Nano Banana Pro Text-to-image",             "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-pro/edit",                     "provider": "Google", "name": "Nano Banana Pro Edit",                     "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-pro/text-to-image-ultra",      "provider": "Google", "name": "Nano Banana Pro T2I Ultra",                 "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-pro/edit-ultra",               "provider": "Google", "name": "Nano Banana Pro Edit Ultra",                "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-pro/text-to-image-developer",  "provider": "Google", "name": "Nano Banana Pro T2I Developer",             "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana-pro/edit-developer",           "provider": "Google", "name": "Nano Banana Pro Edit Developer",            "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _NANO_IMG},
    {"id": "google/nano-banana/text-to-image",                "provider": "Google", "name": "Nano Banana Text-to-image",                 "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana/edit",                         "provider": "Google", "name": "Nano Banana Edit",                         "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _NANO_IMG},
    {"id": "google/nano-banana/text-to-image-developer",      "provider": "Google", "name": "Nano Banana T2I Developer",                 "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _NANO_IMG},
    {"id": "google/nano-banana/edit-developer",               "provider": "Google", "name": "Nano Banana Edit Developer",                "type": "Image", "mode": "edit",             "supports_image": True,  "supported_params": _NANO_IMG},
    # Youchuan / Midjourney (image) — aspect_ratio, hd, stylize, chaos, weird, sref, quality(1/4), seed
    {"id": "youchuan/v8.2/text-to-image",                     "provider": "Midjourney", "name": "Youchuan V8.2 Text-to-Image",           "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _YOU_IMG},
    {"id": "youchuan/v8.2/image-to-image",                    "provider": "Midjourney", "name": "Youchuan V8.2 Image-to-Image",          "type": "Image", "mode": "image-to-image",   "supports_image": True,  "supported_params": _YOU_IMG},
    {"id": "youchuan/v8.2/blend",                             "provider": "Midjourney", "name": "Youchuan V8.2 Blend",                   "type": "Image", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_IMG},
    {"id": "youchuan/v8.2/style-transfer",                    "provider": "Midjourney", "name": "Youchuan V8.2 Style Transfer",          "type": "Image", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_IMG},
    {"id": "youchuan/v8.2/remove-background",                 "provider": "Midjourney", "name": "Youchuan V8.2 Remove Background",       "type": "Image", "mode": "other",            "supports_image": True,  "supported_params": []},
    {"id": "youchuan/v8.1/text-to-image",                     "provider": "Midjourney", "name": "Youchuan V8.1 Text-to-Image",           "type": "Image", "mode": "text-to-image",    "supports_image": False, "supported_params": _YOU_IMG},
    {"id": "youchuan/v8.1/image-to-image",                    "provider": "Midjourney", "name": "Youchuan V8.1 Image-to-Image",          "type": "Image", "mode": "image-to-image",   "supports_image": True,  "supported_params": _YOU_IMG},
    {"id": "youchuan/v8.1/blend",                             "provider": "Midjourney", "name": "Youchuan V8.1 Blend",                   "type": "Image", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_IMG},
    {"id": "youchuan/v8.1/style-transfer",                    "provider": "Midjourney", "name": "Youchuan V8.1 Style Transfer",          "type": "Image", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_IMG},
    {"id": "youchuan/v8.1/remove-background",                 "provider": "Midjourney", "name": "Youchuan V8.1 Remove Background",       "type": "Image", "mode": "other",            "supports_image": True,  "supported_params": []},

    # ── VIDEO ──────────────────────────────────────────────────────────────
    # ByteDance Seedance (video) — ratio, duration, resolution, generate_audio, watermark, return_last_frame
    {"id": "bytedance/seedance-2.5/text-to-video",            "provider": "ByteDance", "name": "Seedance 2.5 Text-to-Video",              "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.5/image-to-video",           "provider": "ByteDance", "name": "Seedance 2.5 Image-to-Video",             "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.5/reference-to-video",       "provider": "ByteDance", "name": "Seedance 2.5 Reference-to-Video",         "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.0/text-to-video",            "provider": "ByteDance", "name": "Seedance 2.0 Text-to-Video",              "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.0/image-to-video",           "provider": "ByteDance", "name": "Seedance 2.0 Image-to-Video",             "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.0/reference-to-video",       "provider": "ByteDance", "name": "Seedance 2.0 Reference-to-Video",         "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.0-mini/text-to-video",       "provider": "ByteDance", "name": "Seedance 2.0 Mini Text-to-Video",         "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.0-mini/image-to-video",      "provider": "ByteDance", "name": "Seedance 2.0 Mini Image-to-Video",        "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.0-mini/reference-to-video",  "provider": "ByteDance", "name": "Seedance 2.0 Mini Reference-to-Video",    "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.0-fast/text-to-video",       "provider": "ByteDance", "name": "Seedance 2.0 Fast Text-to-Video",         "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.0-fast/image-to-video",      "provider": "ByteDance", "name": "Seedance 2.0 Fast Image-to-Video",        "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-2.0-fast/reference-to-video",  "provider": "ByteDance", "name": "Seedance 2.0 Fast Reference-to-Video",    "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-v1.5-pro/text-to-video",       "provider": "ByteDance", "name": "Seedance v1.5 Pro Text-to-Video",         "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-v1.5-pro/image-to-video",      "provider": "ByteDance", "name": "Seedance v1.5 Pro Image-to-Video",        "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-v1.5-pro/text-to-video-fast",  "provider": "ByteDance", "name": "Seedance v1.5 Pro Text-to-Video Fast",    "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-v1.5-pro/image-to-video-fast", "provider": "ByteDance", "name": "Seedance v1.5 Pro Image-to-Video Fast",   "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _BD_VIDEO},
    {"id": "bytedance/seedance-v1.5-pro/image-to-video-spicy","provider": "ByteDance", "name": "Seedance v1.5 Pro Image-to-Video Spicy",  "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _BD_VIDEO},
    {"id": "bytedance/avatar-omni-human-v1.5",                "provider": "ByteDance", "name": "Avatar Omni Human 1.5",                   "type": "Video", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_VID},
    # MiniMax (video) — ratio, resolution (REQUIRED), duration
    {"id": "minimax/h3/text-to-video",                        "provider": "MiniMax", "name": "MiniMax H3 Text-to-Video",                  "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _MINIMAX_V},
    {"id": "minimax/h3/image-to-video",                       "provider": "MiniMax", "name": "MiniMax H3 Image-to-Video",                 "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _MINIMAX_V},
    {"id": "minimax/h3/reference-to-video",                   "provider": "MiniMax", "name": "MiniMax H3 Reference-to-Video",             "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _MINIMAX_V},
    {"id": "minimax/hailuo-2.3/t2v-standard",                 "provider": "MiniMax", "name": "Hailuo-2.3 T2V Standard",                  "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _MINIMAX_V},
    {"id": "minimax/hailuo-2.3/t2v-pro",                      "provider": "MiniMax", "name": "Hailuo-2.3 T2V Pro",                       "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _MINIMAX_V},
    {"id": "minimax/hailuo-2.3/i2v-standard",                 "provider": "MiniMax", "name": "Hailuo-2.3 I2V Standard",                  "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _MINIMAX_V},
    {"id": "minimax/hailuo-2.3/i2v-pro",                      "provider": "MiniMax", "name": "Hailuo-2.3 I2V Pro",                       "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _MINIMAX_V},
    # Kling (video) — aspect_ratio, duration, sound, negative_prompt, cfg_scale
    {"id": "kwaivgi/kling-v3.0-pro/text-to-video",            "provider": "Kling", "name": "Kling v3.0 Pro Text-to-Video",                "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-v3.0-pro/image-to-video",           "provider": "Kling", "name": "Kling v3.0 Pro Image-to-Video",               "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-v3.0-std/text-to-video",            "provider": "Kling", "name": "Kling v3.0 Std Text-to-Video",                "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-v3.0-std/image-to-video",           "provider": "Kling", "name": "Kling v3.0 Std Image-to-Video",               "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-v3.0-4k/text-to-video",             "provider": "Kling", "name": "Kling v3.0 4K Text-to-Video",                 "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-v3.0-4k/image-to-video",            "provider": "Kling", "name": "Kling v3.0 4K Image-to-Video",                "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-v3.0-turbo/text-to-video",          "provider": "Kling", "name": "Kling V3.0 Turbo Text-to-Video",              "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-v3.0-turbo/image-to-video",         "provider": "Kling", "name": "Kling V3.0 Turbo Image-to-Video",             "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o3-pro/text-to-video",        "provider": "Kling", "name": "Kling Video O3 Pro Text-to-Video",            "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o3-pro/image-to-video",       "provider": "Kling", "name": "Kling Video O3 Pro Image-to-Video",           "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o3-pro/reference-to-video",   "provider": "Kling", "name": "Kling Video O3 Pro Reference-to-Video",       "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o3-pro/video-edit",           "provider": "Kling", "name": "Kling Video O3 Pro Video-Edit",               "type": "Video", "mode": "edit",             "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o3-std/text-to-video",        "provider": "Kling", "name": "Kling Video O3 Std Text-to-Video",            "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o3-std/image-to-video",       "provider": "Kling", "name": "Kling Video O3 Std Image-to-Video",           "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o3-std/reference-to-video",   "provider": "Kling", "name": "Kling Video O3 Std Reference-to-Video",       "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o3-std/video-edit",           "provider": "Kling", "name": "Kling Video O3 Std Video-Edit",               "type": "Video", "mode": "edit",             "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o3-4k/text-to-video",         "provider": "Kling", "name": "Kling Video O3 4K Text-to-Video",             "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o3-4k/image-to-video",        "provider": "Kling", "name": "Kling Video O3 4K Image-to-Video",            "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o1/text-to-video",            "provider": "Kling", "name": "Kling Video O1 Text-to-video",                "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-video-o1/image-to-video",           "provider": "Kling", "name": "Kling Video O1 Image-to-video",               "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-v2.6-pro/text-to-video",            "provider": "Kling", "name": "Kling v2.6 Pro Text-to-Video",                "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-v2.6-pro/image-to-video",           "provider": "Kling", "name": "Kling v2.6 Pro Image-to-Video",               "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _KLING_VID},
    {"id": "kwaivgi/kling-v2.6-pro/avatar",                   "provider": "Kling", "name": "Kling v2.6 Pro Avatar",                      "type": "Video", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_VID},
    {"id": "kwaivgi/kling-v2.6-std/avatar",                   "provider": "Kling", "name": "Kling v2.6 Std Avatar",                      "type": "Video", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_VID},
    {"id": "kwaivgi/kling-v2.6-pro/motion-control",           "provider": "Kling", "name": "Kling v2.6 Pro Motion Control",               "type": "Video", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_VID},
    {"id": "kwaivgi/kling-v3.0-pro/motion-control",           "provider": "Kling", "name": "Kling v3.0 Pro Motion Control",               "type": "Video", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_VID},
    {"id": "kwaivgi/kling-v2.6-std/motion-control",           "provider": "Kling", "name": "Kling v2.6 Std Motion Control",               "type": "Video", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_VID},
    {"id": "kwaivgi/kling-v3.0-std/motion-control",           "provider": "Kling", "name": "Kling v3.0 Std Motion Control",               "type": "Video", "mode": "other",            "supports_image": True,  "supported_params": _BASIC_VID},
    # Wan / HappyHorse (video) — ratio, duration, resolution, seed
    {"id": "alibaba/wan-2.7/text-to-video",                   "provider": "Wan", "name": "Wan-2.7 Text-to-video",                        "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _WAN_VIDEO},
    {"id": "alibaba/wan-2.7/image-to-video",                  "provider": "Wan", "name": "Wan-2.7 Image-to-video",                       "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _WAN_VIDEO},
    {"id": "alibaba/wan-2.7/reference-to-video",              "provider": "Wan", "name": "Wan-2.7 Reference-to-video",                   "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _WAN_VIDEO},
    {"id": "alibaba/wan-2.7/video-edit",                      "provider": "Wan", "name": "Wan-2.7 Video-edit",                           "type": "Video", "mode": "edit",             "supports_image": True,  "supported_params": _WAN_VIDEO},
    {"id": "alibaba/wan-2.6/text-to-video",                   "provider": "Wan", "name": "Wan-2.6 Text-to-video",                        "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _WAN_VIDEO},
    {"id": "alibaba/wan-2.6/image-to-video",                  "provider": "Wan", "name": "Wan-2.6 Image-to-video",                       "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _WAN_VIDEO},
    {"id": "alibaba/wan-2.6/image-to-video-flash",            "provider": "Wan", "name": "Wan-2.6 Image-to-video Flash",                 "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _WAN_VIDEO},
    {"id": "alibaba/wan-2.6/video-to-video",                  "provider": "Wan", "name": "Wan-2.6 Video-to-video",                       "type": "Video", "mode": "other",            "supports_image": True,  "supported_params": _WAN_VIDEO},
    {"id": "alibaba/wan-2.2-spicy/image-to-video",            "provider": "Wan", "name": "Wan-2.2-spicy Image-to-video",                 "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _WAN_VIDEO},
    {"id": "alibaba/wan-2.2-spicy/image-to-video-lora",       "provider": "Wan", "name": "Wan-2.2-spicy Image-to-video Lora",            "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _WAN_VIDEO},
    {"id": "alibaba/wan-2.5/video-extend",                    "provider": "Wan", "name": "Wan-2.5 Video Extend",                         "type": "Video", "mode": "other",            "supports_image": True,  "supported_params": _WAN_VIDEO},
    {"id": "atlascloud/wan-2.7-spicy/text-to-video",          "provider": "Wan", "name": "Wan 2.7 Spicy Text-to-Video",                  "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _WAN_VIDEO},
    {"id": "atlascloud/wan-2.7-spicy/image-to-video",         "provider": "Wan", "name": "Wan 2.7 Spicy Image-to-Video",                 "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _WAN_VIDEO},
    {"id": "alibaba/happyhorse-1.1/text-to-video",            "provider": "Wan", "name": "HappyHorse-1.1 Text-to-video",                 "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _HAPPY_VID},
    {"id": "alibaba/happyhorse-1.1/image-to-video",           "provider": "Wan", "name": "HappyHorse-1.1 Image-to-video",                "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _HAPPY_VID},
    {"id": "alibaba/happyhorse-1.1/reference-to-video",       "provider": "Wan", "name": "HappyHorse-1.1 Reference-to-video",            "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _HAPPY_VID},
    {"id": "alibaba/happyhorse-1.0/text-to-video",            "provider": "Wan", "name": "HappyHorse-1.0 Text-to-video",                 "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _HAPPY_VID},
    {"id": "alibaba/happyhorse-1.0/image-to-video",           "provider": "Wan", "name": "HappyHorse-1.0 Image-to-video",                "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _HAPPY_VID},
    {"id": "alibaba/happyhorse-1.0/reference-to-video",       "provider": "Wan", "name": "HappyHorse-1.0 Reference-to-video",            "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _HAPPY_VID},
    {"id": "alibaba/happyhorse-1.0/video-edit",               "provider": "Wan", "name": "HappyHorse-1.0 Video-edit",                    "type": "Video", "mode": "edit",             "supports_image": True,  "supported_params": _HAPPY_VID},
    # Google Veo (video) — aspect_ratio, duration, resolution, generate_audio, seed, negative_prompt
    {"id": "google/veo3.1/text-to-video",                     "provider": "Google", "name": "Veo3.1 Text-to-video",                     "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _VEO_VIDEO},
    {"id": "google/veo3.1/image-to-video",                    "provider": "Google", "name": "Veo3.1 Image-to-video",                    "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _VEO_VIDEO},
    {"id": "google/veo3.1/reference-to-video",                "provider": "Google", "name": "Veo3.1 Reference-to-video",                "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _VEO_VIDEO},
    {"id": "google/veo3.1-lite/text-to-video",                "provider": "Google", "name": "Veo 3.1 Lite Text-to-video",               "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _VEO_VIDEO},
    {"id": "google/veo3.1-lite/image-to-video",               "provider": "Google", "name": "Veo 3.1 Lite Image-to-video",              "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _VEO_VIDEO},
    {"id": "google/veo3.1-lite/start-end-frame-to-video",     "provider": "Google", "name": "Veo 3.1 Lite Start-End Frame to Video",    "type": "Video", "mode": "other",            "supports_image": True,  "supported_params": _VEO_VIDEO},
    {"id": "google/veo3.1-fast/text-to-video",                "provider": "Google", "name": "Veo3.1 Fast Text-to-video",                "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _VEO_VIDEO},
    {"id": "google/veo3.1-fast/image-to-video",               "provider": "Google", "name": "Veo3.1 Fast Image-to-video",               "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _VEO_VIDEO},
    # Google Gemini Omni Flash (video) — aspect_ratio, duration, thinking_level, resolution, seed
    {"id": "google/gemini-omni-flash/text-to-video",          "provider": "Google", "name": "Gemini Omni Flash Text-to-Video",          "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _GEMINI_VID},
    {"id": "google/gemini-omni-flash/image-to-video",         "provider": "Google", "name": "Gemini Omni Flash Image-to-Video",         "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _GEMINI_VID},
    {"id": "google/gemini-omni-flash/reference-to-video",     "provider": "Google", "name": "Gemini Omni Flash Reference-to-Video",     "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _GEMINI_VID},
    {"id": "google/gemini-omni-flash/video-edit",             "provider": "Google", "name": "Gemini Omni Flash Video Edit",             "type": "Video", "mode": "edit",             "supports_image": True,  "supported_params": _GEMINI_VID},
    {"id": "google/gemini-omni-flash/text-to-video-developer","provider": "Google", "name": "Gemini Omni Flash T2V Developer",          "type": "Video", "mode": "text-to-video",    "supports_image": False, "supported_params": _GEMINI_VID},
    {"id": "google/gemini-omni-flash/image-to-video-developer","provider": "Google", "name": "Gemini Omni Flash I2V Developer",         "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _GEMINI_VID},
    {"id": "google/gemini-omni-flash/reference-to-video-developer","provider": "Google", "name": "Gemini Omni Flash R2V Developer",    "type": "Video", "mode": "reference-to-video","supports_image": True, "supported_params": _GEMINI_VID},
    # Youchuan (video) — minimal
    {"id": "youchuan/v8.2/image-to-video",                    "provider": "Midjourney", "name": "Youchuan V8.2 Image-to-Video",          "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _MID_VID},
    {"id": "youchuan/v8.1/image-to-video",                    "provider": "Midjourney", "name": "Youchuan V8.1 Image-to-Video",          "type": "Video", "mode": "image-to-video",   "supports_image": True,  "supported_params": _MID_VID},
]

MODEL_MAP: dict[str, dict] = {m["id"]: m for m in _CATALOGUE}


def _headers():
    return {"Authorization": f"Bearer {ATLAS_API_KEY}", "Content-Type": "application/json"}


@router.get("/models")
async def get_models():
    """Return curated model catalogue with providers."""
    return {"models": list(MODEL_MAP.values())}


@router.get("/models/{model_id:path}")
async def get_model_details(model_id: str):
    if model_id in MODEL_MAP:
        return {"model": MODEL_MAP[model_id]}
    raise HTTPException(status_code=404, detail=f"Model '{model_id}' not found in catalogue")


@router.get("/status/{prediction_id}")
@limiter.limit("30/minute")
async def get_generation_status(request: Request, prediction_id: str):
    """Poll Atlas Cloud for prediction status."""
    if not ATLAS_API_KEY:
        return {"status": "completed", "output": None, "prediction_id": prediction_id}
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                f"{ATLAS_BASE_URL}/model/prediction/{prediction_id}",
                headers=_headers()
            )
            if r.status_code == 200:
                resp_json = r.json()
                data = resp_json.get("data", {})
                status = data.get("status", "processing")
                outputs = data.get("outputs", [])
                output_url = None
                if isinstance(outputs, list) and len(outputs) > 0:
                    output_url = outputs[0]
                elif isinstance(outputs, str):
                    output_url = outputs
                if status == "completed" and not output_url:
                    output_url = data.get("output") or data.get("url")
                return {"status": status, "output": output_url, "prediction_id": prediction_id, "raw": data}
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
    motion: Optional[str] = Form(None),
    watermark: Optional[str] = Form(None),
    return_last_frame: Optional[str] = Form(None),
    thinking_level: Optional[str] = Form(None),
    media_resolution: Optional[str] = Form(None),
    reference_file: Optional[UploadFile] = File(None)
):
    if model_keyword not in MODEL_MAP:
        raise HTTPException(status_code=400, detail=f"Unsupported model: '{model_keyword}'.")

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
            raise HTTPException(status_code=400, detail="Invalid file type.")
        raw_bytes = await reference_file.read()
        if len(raw_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Reference file exceeds 10MB limit.")

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
                upload_res = await client.post(
                    f"{ATLAS_BASE_URL}/model/uploadMedia",
                    headers={"Authorization": f"Bearer {ATLAS_API_KEY}"},
                    files={"file": (reference_file.filename, raw_bytes, reference_file.content_type)}
                )
                if upload_res.status_code not in (200, 201):
                    logger.error(f"Media upload failed: status={upload_res.status_code} body={upload_res.text[:300]}")
                    raise HTTPException(status_code=502, detail="Failed to upload reference file to Atlas Cloud.")
                upload_json = upload_res.json()
                data_obj = upload_json.get("data", {})
                image_url_for_payload = (
                    data_obj.get("download_url") or
                    data_obj.get("url") or
                    upload_json.get("url")
                )
                if not image_url_for_payload:
                    raise HTTPException(status_code=502, detail="Atlas returned no URL after upload.")

            payload: dict = {"model": model_keyword, "prompt": prompt}
            prov = model_info["provider"]

            def _bool(v: Optional[str]) -> Optional[bool]:
                if v is None:
                    return None
                return v.lower() in ("true", "1", "yes")

            # ── Aspect ratio / ratio ─────────────────────────────────────
            # "aspect_ratio" = Kling, Veo, Gemini, Nano, Imagen, Youchuan
            # "ratio"        = ByteDance, Wan, MiniMax, HappyHorse
            if "aspect_ratio" in supported:
                payload["aspect_ratio"] = aspect_ratio
            if "ratio" in supported:
                payload["ratio"] = aspect_ratio

            # ── Duration ────────────────────────────────────────────────
            if type == "Video" and "duration" in supported:
                try:
                    payload["duration"] = int(str(duration).replace("s", "").strip())
                except ValueError:
                    payload["duration"] = 5

            # ── Resolution / size ────────────────────────────────────────
            # Different providers use "resolution", "size" with different formats
            if "resolution" in supported:
                # MiniMax REQUIRES resolution even if not provided — default 2K
                res_val = resolution or ("2K" if prov == "MiniMax" else None)
                if res_val:
                    # Normalise casing for MiniMax ("768P"/"2K") and HappyHorse ("480p"/"720p"/"1080p")
                    if prov == "MiniMax":
                        mm_map = {"768p": "768P", "720p": "768P", "2k": "2K", "1080p": "2K", "2K": "2K", "768P": "768P"}
                        payload["resolution"] = mm_map.get(res_val, "2K")
                    elif prov in ("ByteDance",):
                        # ByteDance: 480p, 720p, 720p-esr, 1080p-esr, 1440p-esr, 4k-esr
                        payload["resolution"] = res_val
                    else:
                        payload["resolution"] = res_val
            elif "size" in supported:
                # ByteDance Image: size format "W*H"
                if prov == "ByteDance":
                    bd_img_map = {
                        "1:1": "2048*2048", "16:9": "2720*1530", "9:16": "1530*2720",
                        "4:3": "2304*1728", "3:4": "1728*2304", "3:2": "2496*1664", "2:3": "1664*2496",
                        "1080p": "1024*1024", "2k": "2048*2048",
                    }
                    payload["size"] = bd_img_map.get(aspect_ratio, bd_img_map.get((resolution or "").lower(), "2048*2048"))
                # FLUX: size format "W*H"
                elif prov == "FLUX":
                    flux_map = {
                        "16:9": "1280*720", "9:16": "720*1280", "1:1": "1024*1024",
                        "4:3": "1024*768", "3:4": "768*1024", "720p": "1280*720",
                        "1080p": "1920*1080", "2k": "2048*2048",
                    }
                    payload["size"] = flux_map.get(aspect_ratio, flux_map.get((resolution or "").lower(), "1024*1024"))
                # OpenAI: size format "WxH"
                elif prov == "OpenAI":
                    openai_map = {
                        "1:1": "1024x1024", "16:9": "1536x1024", "9:16": "1024x1536",
                        "4:3": "1024x768", "3:4": "768x1024", "2:3": "1024x1536",
                        "720p": "1024x768", "1080p": "1024x1024", "1440p": "1536x1024",
                        "2k": "2048x2048", "4k": "2880x2160",
                    }
                    payload["size"] = openai_map.get(aspect_ratio, openai_map.get((resolution or "").lower(), "1024x1024"))
                # Wan Image: "1K"/"2K"
                elif prov == "Wan":
                    wan_map = {"1k": "1K", "2k": "2K", "720p": "1K", "1080p": "2K", "1K": "1K", "2K": "2K"}
                    payload["size"] = wan_map.get((resolution or "1K").replace(" ", ""), "1K")

            # ── Image reference ─────────────────────────────────────────
            if image_url_for_payload:
                payload["image"] = image_url_for_payload
                payload["image_url"] = image_url_for_payload

            # ── Audio: generate_audio (Veo) / sound (Kling) ─────────────
            if "generate_audio" in supported:
                ga = _bool(generate_audio)
                if ga is not None:
                    payload["generate_audio"] = ga
            if "sound" in supported:
                ga = _bool(generate_audio)
                if ga is not None:
                    payload["sound"] = ga

            # ── Negative prompt ─────────────────────────────────────────
            if "negative_prompt" in supported and negative_prompt:
                payload["negative_prompt"] = negative_prompt

            # ── Seed ────────────────────────────────────────────────────
            if "seed" in supported and seed is not None:
                payload["seed"] = seed

            # ── Quality ─────────────────────────────────────────────────
            # OpenAI: string "low"/"medium"/"high"
            if "quality" in supported:
                if prov == "OpenAI":
                    if output_quality is not None:
                        payload["quality"] = "low" if output_quality <= 30 else ("medium" if output_quality <= 70 else "high")
                    else:
                        payload["quality"] = "medium"
                # Youchuan: 1 or 4 (number)
                elif prov == "Midjourney":
                    payload["quality"] = 4 if (output_quality or 80) >= 80 else 1
            if "quality_mj" in supported:
                payload["quality"] = 4 if (output_quality or 80) >= 80 else 1

            # ── cfg_scale (Kling) ────────────────────────────────────────
            if "cfg_scale" in supported:
                payload["cfg_scale"] = 0.5

            # ── Watermark / return_last_frame (ByteDance) ────────────────
            if "watermark" in supported:
                wm = _bool(watermark)
                if wm is not None:
                    payload["watermark"] = wm
            if "return_last_frame" in supported:
                rlf = _bool(return_last_frame)
                if rlf is not None:
                    payload["return_last_frame"] = rlf

            # ── Output format ────────────────────────────────────────────
            if "output_format" in supported and output_format:
                payload["output_format"] = output_format

            # ── Thinking level (Nano Banana, Gemini) ────────────────────
            if "thinking_level" in supported and thinking_level and thinking_level != "default":
                payload["thinking_level"] = thinking_level

            # ── Media resolution (Nano Banana) ───────────────────────────
            if "media_resolution" in supported and media_resolution and media_resolution != "default":
                payload["media_resolution"] = media_resolution

            # ── Midjourney/Youchuan-specific ─────────────────────────────
            if "hd" in supported:
                hd_val = _bool(hd)
                if hd_val is not None:
                    payload["hd"] = hd_val
            if "stylize" in supported and stylize is not None:
                payload["stylize"] = stylize
            if "chaos" in supported and chaos is not None:
                payload["chaos"] = chaos
            if "weird" in supported and weird is not None:
                payload["weird"] = weird
            if "sref" in supported and sref:
                payload["sref"] = sref

            # ── Motion (Youchuan video) ──────────────────────────────────
            if "motion" in supported and motion:
                payload["motion"] = motion

            # ── Endpoint ─────────────────────────────────────────────────
            endpoint = "/model/generateVideo" if type == "Video" else "/model/generateImage"

            logger.info(f"Atlas generate: model={model_keyword} endpoint={endpoint} params={list(payload.keys())}")

            r = await client.post(
                f"{ATLAS_BASE_URL}{endpoint}",
                headers=_headers(),
                json=payload
            )

            if r.status_code in (200, 201):
                resp_json = r.json()
                data = resp_json.get("data", resp_json)
                atlas_id = data.get("id") or data.get("prediction_id") or prediction_id
                logger.info(f"Atlas accepted: atlas_id={atlas_id} model={model_keyword}")
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
                raise HTTPException(status_code=r.status_code, detail=f"Generation failed: {err_detail}")

    except HTTPException:
        raise
    except Exception:
        logger.exception(f"Unexpected error during generation: model={model_keyword}")
        raise HTTPException(status_code=500, detail="Internal server error during generation.")
