# SPECIFICATIONS FOR NEXT-GEN AI VIDEO MODELS

Berikut adalah dokumentasi dan spesifikasi model AI video terbaru sebagai referensi bagi sistem saat merancang prompt sinematik:

**Seedance 2.5 (ByteDance)**
- Rilis: 31 Juli 2026
- Kapasitas: Native 30s @ 4K resolution
- Fitur Unggulan: Mendukung hingga 50 referensi multimodal secara bersamaan (sangat kuat untuk *continuity*).
- Platform Resmi: Volcano Engine ARK (https://www.volcengine.com/product/ark) dan BytePlus.
- Aplikasi Konsumen: Jimeng, Dreamina, Doubao Pro, CapCut.
- API Pihak Ketiga:
  - https://apiframe.ai/models/seedance-2.5
  - https://kie.ai/seedance-2-5

**Hailuo H3 / MiniMax H3 (MiniMax)**
- Model ID Resmi: `MiniMax-H3`
- Kapasitas: Output 2K/24fps, durasi 4-15 detik.
- Fitur Unggulan: Audio native yang di-generate bersama video.
- Platform Resmi: MiniMax Open Platform (https://www.minimax.io)
- Aplikasi Konsumen: Hailuo AI app, MiniMax Hub desktop.
- API Pihak Ketiga:
  - https://evolink.ai/hailuo-3
  - https://apiframe.ai/blog/hailuo-03-api
- Catatan Tambahan: Versi open-weights untuk H3 dijanjikan dirilis, namun saat ini baru tersedia via API-only.

**Kling 3.0 (Kuaishou)**
- Rilis: 4 Februari 2026
- Arsitektur: Omni One
- Fitur Unggulan: Mendukung *storyboard multi-shot* secara native (sangat berguna untuk the "Seedance Hard-Cut" atau adegan multi-angle yang agresif).
- Platform Resmi: https://klingai.com

**Pruna AI (P-API)**
- Endpoint Resmi: `https://api.pruna.ai/v1/`
- Autentikasi: Header `apikey: [API_KEY]`
- **Model Image**: 
  - `p-image`: Generasi gambar berkualitas premium (500/min).
  - `p-image-edit`: Edit gambar premium dengan *fine control*.
  - *Lainnya*: `p-image-lora`, `p-image-trainer`, `flux-dev`, `wan-image-small`, `qwen-image`, dsb.
- **Model Video**: 
  - `p-video`: Generasi video berkualitas premium.
  - `p-video-animate`: Menganimasikan *reference subject* menggunakan pergerakan dari *source video*.
  - `p-video-replace`: Mengganti orang dalam video dengan *identity references*.
- Integrasi: Tersedia model async/sync (menggunakan header `Try-Sync: true`). Upload image via `/files`.

**each::labs (each::api & each::sense)**
- Endpoint Resmi: `https://api.eachlabs.ai/v1/prediction`
- Autentikasi: Header `Authorization: Bearer [API_KEY]`
- **Kapasitas**: Platform multi-model yang menyediakan akses ke 500+ model AI untuk gambar, video, 3D, dan audio via satu API.
- **Produk Pendukung**:
  - `each::api`: Akses langsung ke berbagai model via REST (async prediksi dengan webhook).
  - `each::workflows`: Eksekusi pipeline multi-step dengan parameter passing dan fallback configs.
  - `each::sense`: Endpoint kompatibel dengan OpenAI (di `https://eachsense-agent.core.eachlabs.run/v1`) untuk AI agent memilih otomatis model yang tepat melalui instruksi bahasa natural.

**WaveSpeed AI**
- **Kapasitas**: Unified API access ke 1,000+ model AI untuk *text-to-image, image-to-video, text-to-video*, dan *audio generation* (mendukung FLUX, Kling, Veo, Luma, Stable Diffusion, Seedance, Minimax).
- **Integrasi Pendukung**:
  - Tersedia via REST API, Python SDK (`wavespeed-python`), dan Desktop App.
  - **CLI Agent-Native**: Dapat diinstal via `npm install -g @wavespeed/cli`. Dirancang khusus agar AI Agent (seperti ekosistem OS ini) bisa menjalankan model langsung dari terminal (contoh: `wavespeed run <model> -p "prompt"`). Fitur integrasi agent mendalam didukung penuh melalui argument `--json`.
- **Performa**: Eksekusi ultra-cepat (gambar di bawah 2 detik, video di bawah 2 menit).

*Dokumen ini digunakan sebagai referensi internal untuk Director OS, memastikan prompt generation disesuaikan dengan limitasi dan kelebihan model (seperti durasi native 30s untuk Seedance 2.5 dan Storyboard Multi-shot untuk Kling 3.0).*
