# 🎬 Director OS — AI Film Production Web App

[![Powered by Atlas Cloud](https://www.atlascloud.ai/oss-program/powered-by-atlas-cloud.svg)](https://www.atlascloud.ai/?ref=WUVP6C)

**Director OS** adalah web app untuk produksi film bertenaga AI — dari ideasi naskah hingga generasi gambar & video sinematik, semua dalam satu antarmuka agen yang sederhana dan elegan.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🏠 **Home Agent** | Chat langsung dengan GPT-5.6 Sol untuk ideasi, naskah, & strategi kreatif |
| 🖼️ **Image Agent** | Generate gambar storyboard & aset visual via 400+ model di Atlas Cloud |
| 🎥 **Video Agent** | Generate video sinematik (Seedance, Kling, dll) dengan pilihan durasi & aspect ratio |
| 📁 **Asset Library** | Tampilan dashboard semua hasil generate (gambar & video) dalam satu galeri |

---

## 🏗️ Arsitektur

```
director-os-web-v2.1/
├── backend/           # FastAPI + Atlas Cloud CLI integration
│   ├── main.py
│   ├── routers/
│   │   ├── atlas.py       # Model listing & generation endpoints
│   │   └── workflow.py    # Chat / LLM endpoints
│   ├── skills/        # Director OS skill library (34+ skills)
│   ├── .env           # ⚠️ TIDAK pernah di-commit (lihat .gitignore)
│   └── video_models.json
└── frontend/          # Vite + React + TypeScript
    └── src/
        ├── App.tsx    # Main Agent UI (Home / Image / Video / Assets)
        └── index.css  # Apple Liquid Glass design system
```

---

## 🚀 Setup & Menjalankan

### 1. Clone repo
```bash
git clone https://github.com/Fikkk-fx/director-os-web-v2.1.git
cd director-os-web-v2.1
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install fastapi uvicorn python-multipart
```

Buat file `backend/.env` dan isi dengan API Key Atlas Cloud Anda:
```env
ATLAS_API_KEY=your_atlas_cloud_api_key_here
```

> ⚠️ **Jangan pernah meng-commit file `.env` ke repository publik!** File ini sudah di-exclude via `.gitignore`.

Jalankan backend:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser Anda.

---

## 🔌 Integrasi Atlas Cloud

Proyek ini menggunakan [**Atlas Cloud**](https://www.atlascloud.ai/?ref=WUVP6C) sebagai AI provider utama — satu API key untuk akses ke **400+ model** lintas modalitas:

- **LLM:** GPT-5.6 Sol, DeepSeek, GLM, dan lainnya
- **Image:** GPT Image 2, Seedream 5.0, Flux, dan lainnya  
- **Video:** Seedance 2.5, Kling 3.0, Wan, dan lainnya

Integrasi dilakukan via **Atlas CLI** (`atlas chat`, `atlas generate`) yang dipanggil dari backend FastAPI menggunakan `subprocess`. API key disimpan aman di file `.env` lokal dan **tidak pernah di-push ke repo publik**.

---

## 🔒 Keamanan API Key

- API Key Atlas Cloud disimpan di `backend/.env`
- File `.env` sudah di-exclude dari git via `.gitignore` di root
- Untuk deployment, gunakan **GitHub Secrets** atau environment variables dari platform hosting Anda

---

## 📄 Lisensi

MIT License — bebas digunakan dan dikembangkan.

---

<p align="center">
  <a href="https://www.atlascloud.ai/?ref=WUVP6C">
    <img src="https://www.atlascloud.ai/oss-program/powered-by-atlas-cloud.svg" alt="Powered by Atlas Cloud" height="32" />
  </a>
</p>
