from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from routers import atlas, workflow
from dotenv import load_dotenv

load_dotenv()  # Load .env file for local development

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Director OS API",
    description="Backend API for Director OS — Powered by Atlas Cloud",
    version="2.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Allow CORS from specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://director-os-web-v2-1.vercel.app"],
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
