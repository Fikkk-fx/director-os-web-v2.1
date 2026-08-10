from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import atlas, workflow

app = FastAPI(
    title="Director OS API",
    description="Backend API for Director OS Workflow Execution",
    version="1.0.0"
)

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(atlas.router, prefix="/api/atlas", tags=["Atlas Cloud"])
app.include_router(workflow.router, prefix="/api/workflow", tags=["Workflow Skills"])

@app.get("/")
async def root():
    return {"message": "Director OS API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Director OS Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
