from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import atlas, workflow
from dotenv import load_dotenv

load_dotenv()  # Load .env file for local development

app = FastAPI(
    title="Director OS API",
    description="Backend API for Director OS — Powered by Atlas Cloud",
    version="2.0.0"
)

# Allow CORS from any origin (frontend on Vercel, local dev, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(atlas.router,    prefix="/api/atlas",    tags=["Atlas Cloud"])
app.include_router(workflow.router, prefix="/api",          tags=["Chat"])

@app.get("/")
async def root():
    return {"message": "Director OS API is running — Powered by Atlas Cloud"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Director OS Backend v2"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
