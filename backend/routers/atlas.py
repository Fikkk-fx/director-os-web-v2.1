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
# EXACT CURATED MODEL CATALOGUE  — based on actual Atlas capabilities
# ─────────────────────────────────────────────────────────────────────────────
_CATALOGUE = [
    {"id": "bytedance/seedream-v5.0-pro/layer-decomposition", "provider": "ByteDance", "name": "Seedream v5.0 Pro Layer Decomposition", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "qwen-image-3.0/text-to-image", "provider": "Wan", "name": "Qwen Image 3.0 Text-to-Image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "qwen-image-3.0/edit", "provider": "Wan", "name": "Qwen Image 3.0 Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "youchuan/v8.2/remove-background", "provider": "Midjourney", "name": "Youchuan V8.2 Remove Background", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "youchuan/v8.2/style-transfer", "provider": "Midjourney", "name": "Youchuan V8.2 Style Transfer", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "youchuan/v8.2/blend", "provider": "Midjourney", "name": "Youchuan V8.2 Blend", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "youchuan/v8.2/image-to-image", "provider": "Midjourney", "name": "Youchuan V8.2 Image-to-Image", "type": "Image", "mode": "image-to-image", "supports_image": True},
    {"id": "youchuan/v8.2/text-to-image", "provider": "Midjourney", "name": "Youchuan V8.2 Text-to-Image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "bytedance/seedream-v5.0-pro/edit", "provider": "ByteDance", "name": "Seedream v5.0 Pro Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "bytedance/seedream-v5.0-pro/text-to-image", "provider": "ByteDance", "name": "Seedream v5.0 Pro Text-to-Image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/nano-banana-2-lite/edit-developer", "provider": "Google", "name": "Nano Banana 2 Lite Edit Developer", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "google/nano-banana-2-lite/text-to-image-developer", "provider": "Google", "name": "Nano Banana 2 Lite Text-to-Image Developer", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/nano-banana-2-lite/edit", "provider": "Google", "name": "Nano Banana 2 Lite Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "google/nano-banana-2-lite/text-to-image", "provider": "Google", "name": "Nano Banana 2 Lite Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "youchuan/v8.1/remove-background", "provider": "Midjourney", "name": "Youchuan V8.1 Remove Background", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "youchuan/v8.1/style-transfer", "provider": "Midjourney", "name": "Youchuan V8.1 Style Transfer", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "youchuan/v8.1/blend", "provider": "Midjourney", "name": "Youchuan V8.1 Blend", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "youchuan/v8.1/image-to-image", "provider": "Midjourney", "name": "Youchuan V8.1 Image-to-Image", "type": "Image", "mode": "image-to-image", "supports_image": True},
    {"id": "bytedance/seed3d-v2.0/image-to-3d", "provider": "ByteDance", "name": "Seed3D 2.0 Image-to-3D", "type": "Image", "mode": "image-to-image", "supports_image": True},
    {"id": "youchuan/v8.1/text-to-image", "provider": "Midjourney", "name": "Youchuan V8.1 Text-to-Image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/nano-banana-2/reference-to-image", "provider": "Google", "name": "Nano Banana 2 Reference to Image", "type": "Image", "mode": "reference-to-image", "supports_image": True},
    {"id": "google/nano-banana-2/reference-to-image-developer", "provider": "Google", "name": "Nano Banana 2 Reference to Image Developer", "type": "Image", "mode": "reference-to-image", "supports_image": True},
    {"id": "openai/gpt-image-2/text-to-image", "provider": "Openai", "name": "Openai GPT Image 2 Text-to-Image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "openai/gpt-image-2/edit", "provider": "Openai", "name": "Openai GPT Image 2 Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "alibaba/wan-2.7/text-to-image", "provider": "Wan", "name": "Wan-2.7 Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "alibaba/wan-2.7/image-edit", "provider": "Wan", "name": "Wan-2.7 Image-to-image", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "alibaba/wan-2.7-pro/text-to-image", "provider": "Wan", "name": "Wan-2.7 Pro Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "alibaba/wan-2.7-pro/image-edit", "provider": "Wan", "name": "Wan-2.7 Pro Image-to-image", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "google/nano-banana-2/text-to-image-developer", "provider": "Google", "name": "Nano Banana 2 Text-to-Image Developer", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/nano-banana-2/text-to-image", "provider": "Google", "name": "Nano Banana 2 Text-to-Image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/nano-banana-2/edit-developer", "provider": "Google", "name": "Nano Banana 2 Edit Developer", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "google/nano-banana-2/edit", "provider": "Google", "name": "Nano Banana 2 Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "qwen/qwen-image-2.0/text-to-image", "provider": "Wan", "name": "Qwen Image 2.0 Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "qwen/qwen-image-2.0/edit", "provider": "Wan", "name": "Qwen Image 2.0 Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "qwen/qwen-image-2.0-pro/edit", "provider": "Wan", "name": "Qwen Image 2.0 Pro Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "qwen/qwen-image-2.0-pro/text-to-image", "provider": "Wan", "name": "Qwen Image 2.0 Pro Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "bytedance/seedream-v5.0-lite/edit-sequential", "provider": "ByteDance", "name": "Seedream v5.0 Lite Edit Sequential", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "bytedance/seedream-v5.0-lite/sequential", "provider": "ByteDance", "name": "Seedream v5.0 Lite Sequential", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "bytedance/seedream-v5.0-lite/edit", "provider": "ByteDance", "name": "Seedream v5.0 Lite Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "bytedance/seedream-v5.0-lite", "provider": "ByteDance", "name": "Seedream v5.0 Lite", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "openai/gpt-image-1.5/text-to-image", "provider": "Openai", "name": "Openai GPT Image-1.5 Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "openai/gpt-image-1.5/edit", "provider": "Openai", "name": "Openai GPT Image-1.5 Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "alibaba/qwen-image/edit-plus-20251215", "provider": "Wan", "name": "Qwen-Image Edit Plus 20251215", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "alibaba/wan-2.6/image-edit", "provider": "Wan", "name": "Wan-2.6 Image-to-image", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "openai/gpt-image-1/text-to-image", "provider": "Openai", "name": "Openai GPT Image-1 Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "openai/gpt-image-1/edit", "provider": "Openai", "name": "Openai GPT Image-1 Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "openai/gpt-image-1-mini/text-to-image", "provider": "Openai", "name": "Openai GPT Image-1 Mini Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "openai/gpt-image-1-mini/edit", "provider": "Openai", "name": "Openai GPT Image-1 Mini Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "bytedance/seedream-v4.5", "provider": "ByteDance", "name": "Seedream v4.5", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "bytedance/seedream-v4.5/edit", "provider": "ByteDance", "name": "Seedream v4.5 Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "bytedance/seedream-v4.5/sequential", "provider": "ByteDance", "name": "Seedream v4.5 Sequential", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "bytedance/seedream-v4.5/edit-sequential", "provider": "ByteDance", "name": "Seedream v4.5 Edit Sequential", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "atlascloud/qwen-image/edit", "provider": "Wan", "name": "Qwen Image Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "google/nano-banana-pro/text-to-image-ultra", "provider": "Google", "name": "Nano Banana Pro Text-to-image Ultra", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/nano-banana-pro/edit-ultra", "provider": "Google", "name": "Nano Banana Pro Edit Ultra", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "google/nano-banana-pro/text-to-image", "provider": "Google", "name": "Nano Banana Pro Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "alibaba/qwen-image/text-to-image-max", "provider": "Wan", "name": "Qwen-Image Text-to-image Max", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "alibaba/qwen-image/text-to-image-plus", "provider": "Wan", "name": "Qwen-Image Text-to-image Plus", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/nano-banana-pro/edit", "provider": "Google", "name": "Nano Banana Pro Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "openai/gpt-image-2-developer/edit", "provider": "Openai", "name": "GPT Image 2 Developer Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "alibaba/wan-2.5/image-edit", "provider": "Wan", "name": "Wan-2.5 Image Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "openai/gpt-image-2-developer/text-to-image", "provider": "Openai", "name": "GPT Image 2 Developer Text-to-Image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "alibaba/wan-2.5/text-to-image", "provider": "Wan", "name": "Wan-2.5 Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "bytedance/seedream-v4", "provider": "ByteDance", "name": "Seedream v4", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "bytedance/seedream-v4/sequential", "provider": "ByteDance", "name": "Seedream v4 Sequential", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "google/nano-banana-pro/text-to-image-developer", "provider": "Google", "name": "Nano Banana Pro Text-to-image Developer", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/nano-banana/text-to-image-developer", "provider": "Google", "name": "Nano Banana Text-to-image Developer", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "bytedance/seedream-v4/edit", "provider": "ByteDance", "name": "Seedream v4 Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "alibaba/qwen-image/edit", "provider": "Wan", "name": "Qwen-Image Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "alibaba/qwen-image/edit-plus", "provider": "Wan", "name": "Qwen-Image Edit Plus", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "alibaba/wan-2.6/text-to-image", "provider": "Wan", "name": "Wan-2.6 Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/nano-banana-pro/edit-developer", "provider": "Google", "name": "Nano Banana Pro Edit Developer", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "google/nano-banana/edit-developer", "provider": "Google", "name": "Nano Banana Edit Developer", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "bytedance/seedream-v4/edit-sequential", "provider": "ByteDance", "name": "Seedream v4 Edit Sequential", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "google/nano-banana/text-to-image", "provider": "Google", "name": "Nano Banana Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/nano-banana/edit", "provider": "Google", "name": "Nano Banana Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "google/imagen3", "provider": "Google", "name": "Imagen3", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "google/imagen3-fast", "provider": "Google", "name": "Image3 Fast", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "atlascloud/qwen-image/text-to-image", "provider": "Wan", "name": "Qwen Image Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "google/imagen4-fast", "provider": "Google", "name": "Imagen4 Fast", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "black-forest-labs/flux-dev", "provider": "FLUX", "name": "Flux Dev", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "black-forest-labs/flux-kontext-dev", "provider": "FLUX", "name": "Flux Kontext Dev", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "google/imagen4-ultra", "provider": "Google", "name": "Imagen4 Ultra", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "google/imagen4", "provider": "Google", "name": "Imagen4", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "black-forest-labs/flux-kontext-dev-lora", "provider": "FLUX", "name": "Flux Kontext Dev Lora", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "black-forest-labs/flux-schnell", "provider": "FLUX", "name": "Flux Schnell", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "google/nano-banana-2-lite/reference-to-image", "provider": "Google", "name": "Nano Banana 2 Lite Reference-to-image", "type": "Image", "mode": "reference-to-image", "supports_image": True},
    {"id": "black-forest-labs/flux-2-flex/edit", "provider": "FLUX", "name": "FLUX.2 Flex Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "black-forest-labs/flux-2-flex/text-to-image", "provider": "FLUX", "name": "FLUX.2 Flex Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "black-forest-labs/flux-2-pro/edit", "provider": "FLUX", "name": "FLUX.2 Pro Edit", "type": "Image", "mode": "edit", "supports_image": True},
    {"id": "black-forest-labs/flux-2-pro/text-to-image", "provider": "FLUX", "name": "FLUX.2 Pro Text-to-image", "type": "Image", "mode": "text-to-image", "supports_image": False},
    {"id": "black-forest-labs/flux-dev-lora", "provider": "FLUX", "name": "Flux Dev Lora", "type": "Image", "mode": "other", "supports_image": True},
    {"id": "bytedance/seedance-2.5/reference-to-video", "provider": "ByteDance", "name": "Seedance 2.5 Reference-to-Video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "bytedance/seedance-2.5/image-to-video", "provider": "ByteDance", "name": "Seedance 2.5 Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "bytedance/seedance-2.5/text-to-video", "provider": "ByteDance", "name": "Seedance 2.5 Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "minimax/h3/text-to-video", "provider": "MiniMax", "name": "MiniMax H3 Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "minimax/h3/image-to-video", "provider": "MiniMax", "name": "MiniMax H3 Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "minimax/h3/reference-to-video", "provider": "MiniMax", "name": "MiniMax H3 Reference-to-Video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "youchuan/v8.2/image-to-video", "provider": "Midjourney", "name": "Youchuan V8.2 Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "bytedance/seedance-2.0-mini/reference-to-video", "provider": "ByteDance", "name": "Seedance 2.0 Mini Reference-to-Video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "bytedance/seedance-2.0-mini/image-to-video", "provider": "ByteDance", "name": "Seedance 2.0 Mini Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "bytedance/seedance-2.0-mini/text-to-video", "provider": "ByteDance", "name": "Seedance 2.0 Mini Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "alibaba/happyhorse-1.1/text-to-video", "provider": "Wan", "name": "HappyHorse-1.1 Text-to-video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "alibaba/happyhorse-1.1/image-to-video", "provider": "Wan", "name": "HappyHorse-1.1 Image-to-video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "alibaba/happyhorse-1.1/reference-to-video", "provider": "Wan", "name": "HappyHorse-1.1 Reference-to-video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "google/gemini-omni-flash/reference-to-video", "provider": "Google", "name": "Gemini Omni Flash Reference-to-Video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "google/gemini-omni-flash/image-to-video", "provider": "Google", "name": "Gemini Omni Flash Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "google/gemini-omni-flash/video-edit", "provider": "Google", "name": "Gemini Omni Flash Video Edit", "type": "Video", "mode": "edit", "supports_image": True},
    {"id": "google/gemini-omni-flash/text-to-video", "provider": "Google", "name": "Gemini Omni Flash Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "google/gemini-omni-flash/reference-to-video-developer", "provider": "Google", "name": "Gemini Omni Flash Reference-to-Video Developer", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "bytedance/avatar-omni-human-v1.5", "provider": "ByteDance", "name": "Avatar Omni Human 1.5", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-turbo/image-to-video", "provider": "Kling", "name": "Kling V3.0 Turbo Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-turbo/text-to-video", "provider": "Kling", "name": "Kling V3.0 Turbo Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "kwaivgi/kling-video-o3-4k/image-to-video", "provider": "Kling", "name": "Kling Video O3 4K Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-4k/text-to-video", "provider": "Kling", "name": "Kling Video O3 4K Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "youchuan/v8.1/image-to-video", "provider": "Midjourney", "name": "Youchuan V8.1 Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "google/gemini-omni-flash/image-to-video-developer", "provider": "Google", "name": "Gemini Omni Flash Image-to-Video Developer", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "google/gemini-omni-flash/text-to-video-developer", "provider": "Google", "name": "Gemini Omni Flash Text-to-Video Developer", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "alibaba/happyhorse-1.0/text-to-video", "provider": "Wan", "name": "HappyHorse-1.0 Text-to-video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "alibaba/happyhorse-1.0/image-to-video", "provider": "Wan", "name": "HappyHorse-1.0 Image-to-video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "alibaba/happyhorse-1.0/reference-to-video", "provider": "Wan", "name": "HappyHorse-1.0 Reference-to-video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "alibaba/happyhorse-1.0/video-edit", "provider": "Wan", "name": "HappyHorse-1.0 Video-edit", "type": "Video", "mode": "edit", "supports_image": True},
    {"id": "bytedance/seedance-2.0/text-to-video", "provider": "ByteDance", "name": "Seedance 2.0 Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "bytedance/seedance-2.0/image-to-video", "provider": "ByteDance", "name": "Seedance 2.0 Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "bytedance/seedance-2.0/reference-to-video", "provider": "ByteDance", "name": "Seedance 2.0 Reference-to-Video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "bytedance/seedance-2.0-fast/text-to-video", "provider": "ByteDance", "name": "Seedance 2.0 Fast Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "bytedance/seedance-2.0-fast/image-to-video", "provider": "ByteDance", "name": "Seedance 2.0 Fast Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "bytedance/seedance-2.0-fast/reference-to-video", "provider": "ByteDance", "name": "Seedance 2.0 Fast Reference-to-Video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "alibaba/wan-2.7/text-to-video", "provider": "Wan", "name": "Wan-2.7 Text-to-video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "alibaba/wan-2.7/image-to-video", "provider": "Wan", "name": "Wan-2.7 Image-to-video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "alibaba/wan-2.7/reference-to-video", "provider": "Wan", "name": "Wan-2.7 Reference-to-video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "alibaba/wan-2.7/video-edit", "provider": "Wan", "name": "Wan-2.7 Video-edit", "type": "Video", "mode": "edit", "supports_image": True},
    {"id": "google/veo3.1-lite/text-to-video", "provider": "Google", "name": "Veo 3.1 Lite Text-to-video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "google/veo3.1-lite/start-end-frame-to-video", "provider": "Google", "name": "Veo 3.1 Lite Start-End Frame to Video", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "google/veo3.1-lite/image-to-video", "provider": "Google", "name": "Veo 3.1 Lite Image-to-video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "google/veo3.1-fast/image-to-video", "provider": "Google", "name": "Veo3.1 Fast Image-to-video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "google/veo3.1-fast/text-to-video", "provider": "Google", "name": "Veo3.1 Fast Text-to-video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "google/veo3.1/image-to-video", "provider": "Google", "name": "Veo3.1 Image-to-video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "google/veo3.1/reference-to-video", "provider": "Google", "name": "Veo3.1 Reference-to-video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "google/veo3.1/text-to-video", "provider": "Google", "name": "Veo3.1 Text-to-video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "alibaba/wan-2.2-spicy/image-to-video-lora", "provider": "Wan", "name": "Wan-2.2-spicy Image-to-video Lora", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "alibaba/wan-2.2-spicy/image-to-video", "provider": "Wan", "name": "Wan-2.2-spicy Image-to-video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-4k/image-to-video", "provider": "Kling", "name": "Kling v3.0 4K Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-std/image-to-video", "provider": "Kling", "name": "Kling v3.0 Std Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-pro/image-to-video", "provider": "Kling", "name": "Kling v3.0 Pro Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-pro/text-to-video", "provider": "Kling", "name": "Kling v3.0 Pro Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-4k/text-to-video", "provider": "Kling", "name": "Kling v3.0 4K Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "kwaivgi/kling-v3.0-std/text-to-video", "provider": "Kling", "name": "Kling v3.0 Std Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "kwaivgi/kling-v2.6-pro/avatar", "provider": "Kling", "name": "Kling v2.6 Pro Avatar", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "kwaivgi/kling-v2.6-std/avatar", "provider": "Kling", "name": "Kling v2.6 Std Avatar", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "kwaivgi/kling-v2.6-pro/motion-control", "provider": "Kling", "name": "Kling v2.6 Pro Motion Control", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-pro/motion-control", "provider": "Kling", "name": "Kling v3.0 Pro Motion Control", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "kwaivgi/kling-v2.6-std/motion-control", "provider": "Kling", "name": "Kling v2.6 Std Motion Control", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "kwaivgi/kling-v3.0-std/motion-control", "provider": "Kling", "name": "Kling v3.0 Std Motion Control", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "alibaba/wan-2.6/image-to-video-flash", "provider": "Wan", "name": "Wan-2.6 Image-to-video Flash", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "bytedance/seedance-v1.5-pro/image-to-video", "provider": "ByteDance", "name": "Seedance v1.5 Pro Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "bytedance/seedance-v1.5-pro/text-to-video", "provider": "ByteDance", "name": "Seedance v1.5 Pro Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "bytedance/seedance-v1.5-pro/image-to-video-fast", "provider": "ByteDance", "name": "Seedance v1.5 Pro Image-to-Video Fast", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "alibaba/wan-2.6/image-to-video", "provider": "Wan", "name": "Wan-2.6 Image-to-video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "alibaba/wan-2.6/video-to-video", "provider": "Wan", "name": "Wan-2.6 Video-to-video", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "alibaba/wan-2.6/text-to-video", "provider": "Wan", "name": "Wan-2.6 Text-to-video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "kwaivgi/kling-video-o3-pro/video-edit", "provider": "Kling", "name": "Kling Video O3 Pro Video-Edit", "type": "Video", "mode": "edit", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-pro/reference-to-video", "provider": "Kling", "name": "Kling Video O3 Pro Reference-to-Video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-pro/image-to-video", "provider": "Kling", "name": "Kling Video O3 Pro Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-pro/text-to-video", "provider": "Kling", "name": "Kling Video O3 Pro Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "bytedance/seedance-v1.5-pro/text-to-video-fast", "provider": "ByteDance", "name": "Seedance v1.5 Pro Text-to-Video Fast", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "kwaivgi/kling-v2.6-pro/text-to-video", "provider": "Kling", "name": "Kling v2.6 Pro Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "kwaivgi/kling-v2.6-pro/image-to-video", "provider": "Kling", "name": "Kling v2.6 Pro Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-std/video-edit", "provider": "Kling", "name": "Kling Video O3 Std Video-Edit", "type": "Video", "mode": "edit", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-std/reference-to-video", "provider": "Kling", "name": "Kling Video O3 Std Reference-to-Video", "type": "Video", "mode": "reference-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-std/image-to-video", "provider": "Kling", "name": "Kling Video O3 Std Image-to-Video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o3-std/text-to-video", "provider": "Kling", "name": "Kling Video O3 Std Text-to-Video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "kwaivgi/kling-video-o1/image-to-video", "provider": "Kling", "name": "Kling Video O1 Image-to-video", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "kwaivgi/kling-video-o1/text-to-video", "provider": "Kling", "name": "Kling Video O1 Text-to-video", "type": "Video", "mode": "text-to-video", "supports_image": False},
    {"id": "bytedance/seedance-v1.5-pro/image-to-video-spicy", "provider": "ByteDance", "name": "Seedance v1.5 Pro Image-to-Video Spicy", "type": "Video", "mode": "image-to-video", "supports_image": True},
    {"id": "alibaba/wan-2.5/video-extend", "provider": "Wan", "name": "Wan-2.5 Video Extend", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "minimax/hailuo-2.3/t2v-standard", "provider": "MiniMax", "name": "Hailuo-2.3 t2v Standard", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "minimax/hailuo-2.3/t2v-pro", "provider": "MiniMax", "name": "Hailuo-2.3 t2v Pro", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "minimax/hailuo-2.3/i2v-standard", "provider": "MiniMax", "name": "Hailuo-2.3 i2v Standard", "type": "Video", "mode": "other", "supports_image": True},
    {"id": "minimax/hailuo-2.3/i2v-pro", "provider": "MiniMax", "name": "Hailuo-2.3 i2v Pro", "type": "Video", "mode": "other", "supports_image": True},
]

# Static schema map based on Atlas official API structure
def _get_supported_params(provider: str, type: str) -> list:
    if type == "Video":
        if provider == "ByteDance":
            return ["aspect_ratio", "duration", "resolution", "output_format", "generate_audio", "watermark", "return_last_frame"]
        if provider == "MiniMax":
            return ["aspect_ratio", "duration", "resolution"]
        if provider == "Kling":
            return ["aspect_ratio", "duration", "generate_audio", "negative_prompt"]
        if provider == "Wan":
            return ["aspect_ratio", "duration", "resolution", "seed"]
        if provider == "Midjourney":
            return ["resolution", "motion"]
        if provider == "Google":
            return ["aspect_ratio"]
        return ["aspect_ratio", "duration"]
    
    if type == "Image":
        if provider == "OpenAI":
            return ["size", "num_outputs", "output_quality", "output_format"]
        if provider == "Google":
            return ["resolution", "thinking_level", "media_resolution", "output_format"]
        if provider == "FLUX":
            return ["aspect_ratio", "output_format", "seed", "output_quality"]
        if provider == "Wan":
            return ["aspect_ratio", "negative_prompt", "seed", "guidance_scale"]
        if provider == "Midjourney":
            return ["sref", "aspect_ratio", "hd", "stylize", "chaos", "weird", "output_quality", "seed"]
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
    motion: Optional[str] = Form(None),
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
            if "motion"               in supported and motion:                payload["motion"]                = motion

            # Special case for Midjourney quality (mapped from output_quality)
            if model_info["provider"] == "Midjourney" and "output_quality" in supported and output_quality is not None:
                payload["quality"] = output_quality

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
