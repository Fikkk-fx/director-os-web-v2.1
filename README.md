# 🎬 Director OS — AI Film Production Web App

[![Powered by Atlas Cloud](https://www.atlascloud.ai/oss-program/powered-by-atlas-cloud.svg)](https://www.atlascloud.ai/?ref=WUVP6C)

**Director OS** is a web app for AI-powered film production — from screenplay ideation to cinematic image & video generation, all within a single clean agent interface.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🏠 **Home Agent** | Chat directly with GPT-5.6 Sol for ideation, screenwriting, and creative strategy |
| 🖼️ **Image Agent** | Generate storyboard images & visual assets via 400+ models on Atlas Cloud |
| 🎥 **Video Agent** | Generate cinematic videos (Seedance, Kling, etc.) with custom duration & aspect ratio |
| 📁 **Asset Library** | A dashboard gallery for all generated images and videos in one place |

---

## 🏗️ Architecture

```
director-os-web-v2.1/
├── backend/                   # FastAPI + Atlas Cloud CLI integration
│   ├── main.py
│   ├── routers/
│   │   ├── atlas.py           # Model listing & generation endpoints
│   │   └── workflow.py        # Chat / LLM endpoints
│   ├── skills/                # Director OS skill library (34+ skills)
│   ├── .env                   # ⚠️ Never committed (see .gitignore)
│   └── video_models.json
└── frontend/                  # Vite + React + TypeScript
    └── src/
        ├── App.tsx            # Main Agent UI (Home / Image / Video / Assets)
        └── index.css          # Apple Liquid Glass design system
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Fikkk-fx/director-os-web-v2.1.git
cd director-os-web-v2.1
```

### 2. Set up the Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install fastapi uvicorn python-multipart
```

Create a `backend/.env` file and add your Atlas Cloud API key:
```env
ATLAS_API_KEY=your_atlas_cloud_api_key_here
```

> ⚠️ **Never commit your `.env` file to a public repository.** It is already excluded via `.gitignore`.

Start the backend server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Set up the Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔌 Atlas Cloud Integration

This project uses [**Atlas Cloud**](https://www.atlascloud.ai/?ref=WUVP6C) as its core AI provider — one API key unlocking **400+ models** across all modalities:

- **LLM:** GPT-5.6 Sol, DeepSeek, GLM, and more
- **Image:** GPT Image 2, Seedream 5.0, Flux, and more
- **Video:** Seedance 2.5, Kling 3.0, Wan, and more

Integration is done via the **Atlas CLI** (`atlas chat`, `atlas generate`) invoked from the FastAPI backend using `subprocess`. The API key is securely stored in a local `.env` file and **never pushed to the public repository**.

---

## 🔒 API Key Security

- Atlas Cloud API key is stored in `backend/.env`
- The `.env` file is excluded from git via the root `.gitignore`
- For deployment, use **GitHub Secrets** or environment variables from your hosting platform

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React + TypeScript |
| Styling | Vanilla CSS (Apple Liquid Glass) |
| Backend | FastAPI (Python) |
| AI Provider | Atlas Cloud (via CLI) |
| LLM Model | GPT-5.6 Sol |

---

## 📄 License

MIT License — free to use and extend.

---

<p align="center">
  <a href="https://www.atlascloud.ai/?ref=WUVP6C">
    <img src="https://www.atlascloud.ai/oss-program/powered-by-atlas-cloud.svg" alt="Powered by Atlas Cloud" height="32" />
  </a>
</p>
