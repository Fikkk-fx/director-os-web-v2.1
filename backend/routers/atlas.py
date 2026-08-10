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

# ──────────────────────────────────────────────────────────────────────────────
# COMPLETE MODEL CATALOGUE  (sourced live from Atlas Cloud, August 2026)
# ──────────────────────────────────────────────────────────────────────────────
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
    {"id": "openai/gpt-image-2-developer/text-to-image", "name": "GPT Image 2 Dev · T2I",      "type": "Image", "supports_image": False},
    {"id": "openai/gpt-image-2-developer/edit",       "name": "GPT Image 2 Dev · Edit",        "type": "Image", "supports_image": True},
    # ── ByteDance Seedream ───────────────────────────────────────────────────
    {"id": "bytedance/seedream-v5.0-pro/text-to-image", "name": "Seedream v5.0 Pro · T2I",     "type": "Image", "supports_image": False},
    {"id": "bytedance/seedream-v5.0-pro/edit",          "name": "Seedream v5.0 Pro · Edit",    "type": "Image", "supports_image": True},
    {"id": "bytedance/seedream-v5.0-pro/layer-decomposition", "name": "Seedream v5.0 Pro · Layer Decomp", "type": "Image", "supports_image": True},
    {"id": "bytedance/seedream-v5.0-lite",             "name": "Seedream v5.0 Lite",           "type": "Image", "supports_image": False},
    {"id": "bytedance/seedream-v5.0-lite/edit",        "name": "Seedream v5.0 Lite · Edit",    "type": "Image", "supports_image": True},
    {"id": "bytedance/seedream-v5.0-lite/sequential",  "name": "Seedream v5.0 Lite · Batch",   "type": "Image", "supports_image": False},
    {"id": "bytedance/seedream-v4.5",                  "name": "Seedream v4.5",                "type": "Image", "supports_image": False},
    {"id": "bytedance/seedream-v4.5/edit",             "name": "Seedream v4.5 · Edit",         "type": "Image", "supports_image": True},
    {"id": "bytedance/seedream-v4",                    "name": "Seedream v4",                  "type": "Image", "supports_image": False},
    {"id": "bytedance/seedream-v4/edit",               "name": "Seedream v4 · Edit",           "type": "Image", "supports_image": True},
    # ── Black Forest Labs Flux ───────────────────────────────────────────────
    {"id": "black-forest-labs/flux-2-pro/text-to-image", "name": "FLUX.2 Pro · T2I",          "type": "Image", "supports_image": False},
    {"id": "black-forest-labs/flux-2-pro/edit",          "name": "FLUX.2 Pro · Edit",         "type": "Image", "supports_image": True},
    {"id": "black-forest-labs/flux-2-flex/text-to-image","name": "FLUX.2 Flex · T2I",         "type": "Image", "supports_image": False},
    {"id": "black-forest-labs/flux-2-flex/edit",         "name": "FLUX.2 Flex · Edit",        "type": "Image", "supports_image": True},
    {"id": "black-forest-labs/flux-kontext-dev",       "name": "Flux Kontext Dev",             "type": "Image", "supports_image": True},
    {"id": "black-forest-labs/flux-kontext-dev-lora",  "name": "Flux Kontext Dev LoRA",        "type": "Image", "supports_image": True},
    {"id": "black-forest-labs/flux-dev",               "name": "Flux Dev",                     "type": "Image", "supports_image": False},
    {"id": "black-forest-labs/flux-dev-lora",          "name": "Flux Dev LoRA",                "type": "Image", "supports_image": False},
    {"id": "black-forest-labs/flux-schnell",           "name": "Flux Schnell",                 "type": "Image", "supports_image": False},
    # ── Google ───────────────────────────────────────────────────────────────
    {"id": "google/imagen4-ultra",                     "name": "Imagen 4 Ultra",               "type": "Image", "supports_image": False},
    {"id": "google/imagen4",                           "name": "Imagen 4",                     "type": "Image", "supports_image": False},
    {"id": "google/imagen4-fast",                      "name": "Imagen 4 Fast",                "type": "Image", "supports_image": False},
    {"id": "google/imagen3",                           "name": "Imagen 3",                     "type": "Image", "supports_image": False},
    {"id": "google/imagen3-fast",                      "name": "Imagen 3 Fast",                "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-2/text-to-image",       "name": "Nano Banana 2 · T2I",          "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-2/edit",                "name": "Nano Banana 2 · Edit",         "type": "Image", "supports_image": True},
    {"id": "google/nano-banana-2/reference-to-image",  "name": "Nano Banana 2 · Ref2Img",      "type": "Image", "supports_image": True},
    {"id": "google/nano-banana-pro/text-to-image",     "name": "Nano Banana Pro · T2I",        "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-pro/text-to-image-ultra", "name": "Nano Banana Pro · Ultra",    "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-pro/edit",              "name": "Nano Banana Pro · Edit",       "type": "Image", "supports_image": True},
    {"id": "google/nano-banana-2-lite/text-to-image",  "name": "Nano Banana 2 Lite · T2I",     "type": "Image", "supports_image": False},
    {"id": "google/nano-banana-2-lite/edit",           "name": "Nano Banana 2 Lite · Edit",    "type": "Image", "supports_image": True},
    {"id": "google/nano-banana/text-to-image",         "name": "Nano Banana · T2I",            "type": "Image", "supports_image": False},
    {"id": "google/nano-banana/edit",                  "name": "Nano Banana · Edit",           "type": "Image", "supports_image": True},
    # ── Alibaba / Qwen ───────────────────────────────────────────────────────
    {"id": "alibaba/wan-2.7/text-to-image",            "name": "Wan-2.7 · T2I",                "type": "Image", "supports_image": False},
    {"id": "alibaba/wan-2.7/image-edit",               "name": "Wan-2.7 · Edit",               "type": "Image", "supports_image": True},
    {"id": "alibaba/wan-2.7-pro/text-to-image",        "name": "Wan-2.7 Pro · T2I",            "type": "Image", "supports_image": False},
    {"id": "alibaba/wan-2.7-pro/image-edit",           "name": "Wan-2.7 Pro · Edit",           "type": "Image", "supports_image": True},
    {"id": "alibaba/wan-2.6/text-to-image",            "name": "Wan-2.6 · T2I",                "type": "Image", "supports_image": False},
    {"id": "alibaba/wan-2.5/text-to-image",            "name": "Wan-2.5 · T2I",                "type": "Image", "supports_image": False},
    {"id": "alibaba/qwen-image/text-to-image-max",     "name": "Qwen Image 2.0 Max · T2I",     "type": "Image", "supports_image": False},
    {"id": "alibaba/qwen-image/text-to-image-plus",    "name": "Qwen Image 2.0 Plus · T2I",    "type": "Image", "supports_image": False},
    {"id": "qwen/qwen-image-2.0/text-to-image",        "name": "Qwen Image 2.0 · T2I",         "type": "Image", "supports_image": False},
    {"id": "qwen/qwen-image-2.0/edit",                 "name": "Qwen Image 2.0 · Edit",        "type": "Image", "supports_image": True},
    {"id": "qwen/qwen-image-2.0-pro/text-to-image",    "name": "Qwen Image 2.0 Pro · T2I",     "type": "Image", "supports_image": False},
    {"id": "qwen/qwen-image-2.0-pro/edit",             "name": "Qwen Image 2.0 Pro · Edit",    "type": "Image", "supports_image": True},
    {"id": "qwen-image-3.0/text-to-image",             "name": "Qwen Image 3.0 · T2I",         "type": "Image", "supports_image": False},
    {"id": "qwen-image-3.0/edit",                      "name": "Qwen Image 3.0 · Edit",        "type": "Image", "supports_image": True},
    # ── Midjourney (Youchuan) ────────────────────────────────────────────────
    {"id": "youchuan/v8.2/text-to-image",              "name": "Midjourney V8.2 · T2I",        "type": "Image", "supports_image": False},
    {"id": "youchuan/v8.2/image-to-image",             "name": "Midjourney V8.2 · I2I",        "type": "Image", "supports_image": True},
    {"id": "youchuan/v8.2/blend",                      "name": "Midjourney V8.2 · Blend",      "type": "Image", "supports_image": True},
    {"id": "youchuan/v8.2/style-transfer",             "name": "Midjourney V8.2 · Style",      "type": "Image", "supports_image": True},
    {"id": "youchuan/v8.2/remove-background",          "name": "Midjourney V8.2 · RemoveBG",   "type": "Image", "supports_image": True},
    {"id": "youchuan/v8.1/text-to-image",              "name": "Midjourney V8.1 · T2I",        "type": "Image", "supports_image": False},
    {"id": "youchuan/v8.1/image-to-image",             "name": "Midjourney V8.1 · I2I",        "type": "Image", "supports_image": True},
    # ── xAI Grok Imagine ────────────────────────────────────────────────────
    {"id": "xai/grok-imagine-image-quality/text-to-image", "name": "Grok Imagine Quality · T2I", "type": "Image", "supports_image": False},
    {"id": "xai/grok-imagine-image-quality/edit",      "name": "Grok Imagine Quality · Edit",  "type": "Image", "supports_image": True},
    {"id": "xai/grok-imagine-image/text-to-image",     "name": "Grok Imagine · T2I",           "type": "Image", "supports_image": False},
    {"id": "xai/grok-imagine-image/edit",              "name": "Grok Imagine · Edit",          "type": "Image", "supports_image": True},
    # ── Microsoft ────────────────────────────────────────────────────────────
    {"id": "microsoft/mai-image-2.5/text-to-image",    "name": "MAI Image 2.5 · T2I",          "type": "Image", "supports_image": False},
    {"id": "microsoft/mai-image-2.5/edit",             "name": "MAI Image 2.5 · Edit",         "type": "Image", "supports_image": True},
    {"id": "microsoft/mai-image-2.5-flash/text-to-image", "name": "MAI Image 2.5 Flash · T2I", "type": "Image", "supports_image": False},
    {"id": "microsoft/mai-image-2.5-flash/edit",       "name": "MAI Image 2.5 Flash · Edit",   "type": "Image", "supports_image": True},
    # ── Reve AI ──────────────────────────────────────────────────────────────
    {"id": "reve-ai/reve-2.1/text-to-image",           "name": "Reve 2.1 · T2I",               "type": "Image", "supports_image": False},
    {"id": "reve-ai/reve-2.1/edit",                    "name": "Reve 2.1 · Edit",              "type": "Image", "supports_image": True},
    {"id": "reve-ai/reve-2.1/remix",                   "name": "Reve 2.1 · Remix",             "type": "Image", "supports_image": True},
    # ── Ideogram ─────────────────────────────────────────────────────────────
    {"id": "ideogram/v4/quality/text-to-image",        "name": "Ideogram v4 Quality",          "type": "Image", "supports_image": False},
    {"id": "ideogram/v4/turbo/text-to-image",          "name": "Ideogram v4 Turbo",            "type": "Image", "supports_image": False},
    # ── AtlasCloud ──────────────────────────────────────────────────────────
    {"id": "atlascloud/face-swap-image",               "name": "Face Swap (Image)",            "type": "Image", "supports_image": True},
    {"id": "atlascloud/image-upscaler",                "name": "Image Upscaler 4x",            "type": "Image", "supports_image": True},
    {"id": "atlascloud/photo-cleanup",                 "name": "Photo Cleanup",                "type": "Image", "supports_image": True},
    {"id": "z-image/turbo",                            "name": "Z-Image Turbo",                "type": "Image", "supports_image": False},
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
    {"id": "bytedance/seedance-2.0-mini/text-to-video", "name": "Seedance 2.0 Mini · T2V",      "type": "Video", "supports_image": False},
    {"id": "bytedance/seedance-2.0-mini/image-to-video","name": "Seedance 2.0 Mini · I2V",      "type": "Video", "supports_image": True},
    {"id": "bytedance/seedance-v1.5-pro/text-to-video", "name": "Seedance v1.5 Pro · T2V",      "type": "Video", "supports_image": False},
    {"id": "bytedance/seedance-v1.5-pro/image-to-video","name": "Seedance v1.5 Pro · I2V",      "type": "Video", "supports_image": True},
    # ── Kuaishou Kling ───────────────────────────────────────────────────────
    {"id": "kwaivgi/kling-v3.0-pro/text-to-video",     "name": "Kling v3.0 Pro · T2V",         "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-pro/image-to-video",    "name": "Kling v3.0 Pro · I2V",         "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-4k/text-to-video",      "name": "Kling v3.0 4K · T2V",          "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-4k/image-to-video",     "name": "Kling v3.0 4K · I2V",          "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-std/text-to-video",     "name": "Kling v3.0 Std · T2V",         "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-std/image-to-video",    "name": "Kling v3.0 Std · I2V",         "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-turbo/text-to-video",   "name": "Kling v3.0 Turbo · T2V",       "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-turbo/image-to-video",  "name": "Kling v3.0 Turbo · I2V",       "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-pro/text-to-video", "name": "Kling O3 Pro · T2V",           "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-video-o3-pro/image-to-video","name": "Kling O3 Pro · I2V",           "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-4k/text-to-video",  "name": "Kling O3 4K · T2V",            "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-video-o3-4k/image-to-video", "name": "Kling O3 4K · I2V",            "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-std/text-to-video", "name": "Kling O3 Std · T2V",           "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-video-o3-std/image-to-video","name": "Kling O3 Std · I2V",           "type": "Video", "supports_image": True},
    {"id": "kwaivgi/kling-v2.6-pro/text-to-video",     "name": "Kling v2.6 Pro · T2V",         "type": "Video", "supports_image": False},
    {"id": "kwaivgi/kling-v2.6-pro/image-to-video",    "name": "Kling v2.6 Pro · I2V",         "type": "Video", "supports_image": True},
    # ── Google Veo / Gemini Omni ─────────────────────────────────────────────
    {"id": "google/veo3.1/text-to-video",               "name": "Veo 3.1 · T2V",                "type": "Video", "supports_image": False},
    {"id": "google/veo3.1/image-to-video",              "name": "Veo 3.1 · I2V",                "type": "Video", "supports_image": True},
    {"id": "google/veo3.1/reference-to-video",          "name": "Veo 3.1 · Ref2V",              "type": "Video", "supports_image": True},
    {"id": "google/veo3.1-fast/text-to-video",          "name": "Veo 3.1 Fast · T2V",           "type": "Video", "supports_image": False},
    {"id": "google/veo3.1-fast/image-to-video",         "name": "Veo 3.1 Fast · I2V",           "type": "Video", "supports_image": True},
    {"id": "google/veo3.1-lite/text-to-video",          "name": "Veo 3.1 Lite · T2V",           "type": "Video", "supports_image": False},
    {"id": "google/veo3.1-lite/image-to-video",         "name": "Veo 3.1 Lite · I2V",           "type": "Video", "supports_image": True},
    {"id": "google/gemini-omni-flash/text-to-video",    "name": "Gemini Omni Flash · T2V",      "type": "Video", "supports_image": False},
    {"id": "google/gemini-omni-flash/image-to-video",   "name": "Gemini Omni Flash · I2V",      "type": "Video", "supports_image": True},
    {"id": "google/gemini-omni-flash/reference-to-video","name": "Gemini Omni Flash · Ref2V",   "type": "Video", "supports_image": True},
    # ── Alibaba Wan ──────────────────────────────────────────────────────────
    {"id": "alibaba/wan-2.7/text-to-video",             "name": "Wan-2.7 · T2V",                "type": "Video", "supports_image": False},
    {"id": "alibaba/wan-2.7/image-to-video",            "name": "Wan-2.7 · I2V",                "type": "Video", "supports_image": True},
    {"id": "alibaba/wan-2.7/reference-to-video",        "name": "Wan-2.7 · Ref2V",              "type": "Video", "supports_image": True},
    {"id": "alibaba/wan-2.7/video-edit",                "name": "Wan-2.7 · Video Edit",         "type": "Video", "supports_image": True},
    {"id": "alibaba/wan-2.6/text-to-video",             "name": "Wan-2.6 · T2V",                "type": "Video", "supports_image": False},
    {"id": "alibaba/wan-2.6/image-to-video",            "name": "Wan-2.6 · I2V",                "type": "Video", "supports_image": True},
    {"id": "alibaba/happyhorse-1.1/text-to-video",      "name": "HappyHorse 1.1 · T2V",         "type": "Video", "supports_image": False},
    {"id": "alibaba/happyhorse-1.1/image-to-video",     "name": "HappyHorse 1.1 · I2V",         "type": "Video", "supports_image": True},
    # ── MiniMax / Hailuo ─────────────────────────────────────────────────────
    {"id": "minimax/h3/text-to-video",                  "name": "MiniMax H3 · T2V",             "type": "Video", "supports_image": False},
    {"id": "minimax/h3/image-to-video",                 "name": "MiniMax H3 · I2V",             "type": "Video", "supports_image": True},
    {"id": "minimax/h3/reference-to-video",             "name": "MiniMax H3 · Ref2V",           "type": "Video", "supports_image": True},
    {"id": "minimax/hailuo-2.3/t2v-pro",                "name": "Hailuo 2.3 Pro · T2V",         "type": "Video", "supports_image": False},
    {"id": "minimax/hailuo-2.3/t2v-standard",           "name": "Hailuo 2.3 Standard · T2V",    "type": "Video", "supports_image": False},
    {"id": "minimax/hailuo-2.3/i2v-pro",                "name": "Hailuo 2.3 Pro · I2V",         "type": "Video", "supports_image": True},
    {"id": "minimax/hailuo-2.3/i2v-standard",           "name": "Hailuo 2.3 Standard · I2V",    "type": "Video", "supports_image": True},
    # ── Pixverse ─────────────────────────────────────────────────────────────
    {"id": "pixverse/v6/text-to-video",                 "name": "Pixverse v6 · T2V",            "type": "Video", "supports_image": False},
    {"id": "pixverse/v6/image-to-video",                "name": "Pixverse v6 · I2V",            "type": "Video", "supports_image": True},
    {"id": "pixverse/v6/reference-to-video",            "name": "Pixverse v6 · Ref2V",          "type": "Video", "supports_image": True},
    {"id": "pixverse/c1/text-to-video",                 "name": "Pixverse c1 · T2V",            "type": "Video", "supports_image": False},
    {"id": "pixverse/c1/image-to-video",                "name": "Pixverse c1 · I2V",            "type": "Video", "supports_image": True},
    # ── xAI Grok ─────────────────────────────────────────────────────────────
    {"id": "xai/grok-imagine-video-v1.5/text-to-video", "name": "Grok Video v1.5 · T2V",        "type": "Video", "supports_image": False},
    {"id": "xai/grok-imagine-video-v1.5/image-to-video","name": "Grok Video v1.5 · I2V",        "type": "Video", "supports_image": True},
    {"id": "xai/grok-imagine-video/text-to-video",      "name": "Grok Video · T2V",             "type": "Video", "supports_image": False},
    {"id": "xai/grok-imagine-video/image-to-video",     "name": "Grok Video · I2V",             "type": "Video", "supports_image": True},
    # ── Vidu ─────────────────────────────────────────────────────────────────
    {"id": "vidu/q3-pro/text-to-video",                 "name": "Vidu Q3-Pro · T2V",            "type": "Video", "supports_image": False},
    {"id": "vidu/q3-pro/image-to-video",                "name": "Vidu Q3-Pro · I2V",            "type": "Video", "supports_image": True},
    {"id": "vidu/q3-turbo/text-to-video",               "name": "Vidu Q3-Turbo · T2V",          "type": "Video", "supports_image": False},
    {"id": "vidu/q3-turbo/image-to-video",              "name": "Vidu Q3-Turbo · I2V",          "type": "Video", "supports_image": True},
    # ── Midjourney (Youchuan) ────────────────────────────────────────────────
    {"id": "youchuan/v8.2/image-to-video",              "name": "Midjourney V8.2 · I2V",        "type": "Video", "supports_image": True},
    {"id": "youchuan/v8.1/image-to-video",              "name": "Midjourney V8.1 · I2V",        "type": "Video", "supports_image": True},
    # ── AtlasCloud ──────────────────────────────────────────────────────────
    {"id": "atlascloud/wan-2.7-spicy/text-to-video",    "name": "Wan 2.7 Spicy · T2V",          "type": "Video", "supports_image": False},
    {"id": "atlascloud/wan-2.7-spicy/image-to-video",   "name": "Wan 2.7 Spicy · I2V",          "type": "Video", "supports_image": True},
    {"id": "atlascloud/wan-2.2-turbo/image-to-video",   "name": "Wan 2.2 Turbo · I2V",          "type": "Video", "supports_image": True},
    {"id": "atlascloud/face-swap-video",                "name": "Face Swap (Video)",             "type": "Video", "supports_image": True},
    {"id": "atlascloud/video-upscaler",                 "name": "Video Upscaler 2K",            "type": "Video", "supports_image": True},
    {"id": "atlascloud/infinitetalk",                   "name": "InfiniteTalk (Talking Head)",  "type": "Video", "supports_image": True},
]

FALLBACK_MODELS = IMAGE_MODELS + VIDEO_MODELS

def _headers():
    return {
        "Authorization": f"Bearer {ATLAS_API_KEY}",
        "Content-Type": "application/json"
    }


@router.get("/models")
async def get_models():
    """Return full model catalogue — live from Atlas Cloud API or built-in fallback."""
    global MODEL_LIST_CACHE
    if MODEL_LIST_CACHE:
        return {"models": MODEL_LIST_CACHE}

    if not ATLAS_API_KEY:
        MODEL_LIST_CACHE = FALLBACK_MODELS
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
                    if any(k in mid for k in ["image", "flux", "seedream", "dall-e", "gpt-image", "imagen", "nano-banana", "youchuan", "reve", "ideogram", "z-image", "mai-image"]):
                        mtype = "Image"
                    elif any(k in mid for k in ["video", "seedance", "kling", "wan-2", "sora", "veo", "vidu", "pixverse", "hailuo", "minimax/h", "happyhorse", "grok-imagine-video"]):
                        mtype = "Video"
                    else:
                        mtype = "LLM"
                    if mtype in ("Image", "Video"):
                        mapped.append({
                            "id": mid,
                            "name": m.get("name", mid.split("/")[-1]),
                            "type": mtype,
                            "supports_image": "image-to" in mid or "i2v" in mid or "edit" in mid or "reference" in mid
                        })
                if mapped:
                    MODEL_LIST_CACHE = mapped
                    return {"models": mapped}
    except Exception as e:
        print(f"Atlas API model fetch failed: {e}")

    MODEL_LIST_CACHE = FALLBACK_MODELS
    return {"models": FALLBACK_MODELS}


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
    """Submit generation task to Atlas Cloud REST API."""
    try:
        ref_b64 = None
        if reference_file:
            raw_bytes = await reference_file.read()
            ref_b64 = base64.b64encode(raw_bytes).decode("utf-8")

        prediction_id = f"pred_{uuid.uuid4().hex[:12]}"

        if not ATLAS_API_KEY:
            return {
                "status": "success",
                "prediction_id": prediction_id,
                "message": f"[Mock] {type} task submitted — set ATLAS_API_KEY to use real generation.",
                "prompt_used": prompt
            }

        payload: dict = {
            "model": model_keyword,
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
        }
        if type == "Video":
            payload["duration"] = duration
        if ref_b64:
            payload["image"] = f"data:image/jpeg;base64,{ref_b64}"

        async with httpx.AsyncClient(timeout=120) as client:
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
