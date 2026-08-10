from fastapi import APIRouter, HTTPException, File, UploadFile, Form
import os
import subprocess
import json
import tempfile
import shutil
from typing import Optional

router = APIRouter()

# The path to the skills directory
SKILLS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "skills")

@router.get("/skills")
async def get_skills():
    """Reads the skills directory and returns available skills."""
    try:
        skills = []
        if os.path.exists(SKILLS_DIR):
            for item in os.listdir(SKILLS_DIR):
                item_path = os.path.join(SKILLS_DIR, item)
                if os.path.isdir(item_path):
                    # It's a folder, check if SKILL.md exists
                    if os.path.exists(os.path.join(item_path, "SKILL.md")):
                        skills.append({"id": item, "name": item.capitalize(), "type": "Directory"})
                elif item.endswith(".md"):
                    skills.append({"id": item, "name": item.replace(".md", ""), "type": "Markdown"})
        
        # Sort alphabetically
        skills = sorted(skills, key=lambda x: x["name"])
        return {"skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat_with_agent(
    prompt: str = Form(...),
    reference_image: Optional[UploadFile] = File(None)
):
    """General chat endpoint using GPT 5.6 Sol."""
    temp_img_path = None
    try:
        # Save uploaded image to a temporary file if provided
        if reference_image:
            ext = os.path.splitext(reference_image.filename)[1] or ".png"
            fd, temp_img_path = tempfile.mkstemp(suffix=ext)
            with os.fdopen(fd, 'wb') as out_file:
                shutil.copyfileobj(reference_image.file, out_file)
                
        # Build the command for atlas chat
        cmd = [
            "atlas", "chat", 
            "--model", "openai/gpt-5.6-sol", 
            "--system", 
            "You are Director OS, a cinematic AI assistant. Help the user develop their film concepts, screenplays, and visual ideas."
        ]
        
        # We'll use subprocess.run with shell=True for Windows compatibility
        shell_cmd = f'atlas chat --model openai/gpt-5.6-sol --system "You are Director OS, a cinematic AI assistant. Help the user develop their film concepts, screenplays, and visual ideas."'
        
        if temp_img_path:
            safe_path = temp_img_path.replace('\\', '/')
            shell_cmd += f' --image "@{safe_path}"'
            
        safe_prompt = prompt.replace('"', "'")
        shell_cmd += f' "{safe_prompt}"'

        result = subprocess.run(shell_cmd, shell=True, capture_output=True, text=True)
        
        if result.returncode != 0:
            error_msg = result.stderr or result.stdout
            raise HTTPException(status_code=500, detail=f"Atlas chat failed: {error_msg}")
            
        output = result.stdout.strip()
        return {"response": output}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temporary file
        if temp_img_path and os.path.exists(temp_img_path):
            try:
                os.remove(temp_img_path)
            except Exception as e:
                print(f"Error removing temp file {temp_img_path}: {e}")
