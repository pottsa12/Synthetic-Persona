"""
Synthetic Persona Agent - FastAPI Server with Gemini Multimodal Support

This agent simulates consumer personas using Google's Gemini model.
Supports text, images, and video inputs for rich brand feedback.
"""

import os
import base64
from typing import Optional
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Pydantic Models for API ---
class ChatRequest(BaseModel):
    """
    Chat request model for text-only interactions.

    Args:
        user_prompt: The user's question or statement
        brand_context: Context about the brand being discussed
        audience_summary: Description of the persona to embody
    """
    user_prompt: str
    brand_context: str
    audience_summary: str


class ChatResponse(BaseModel):
    """
    Chat response model containing the agent's reply.

    Args:
        agent_response: The persona's response to the user's prompt
    """
    agent_response: str


# --- FastAPI App Initialization ---
app = FastAPI(
    title="Synthetic Persona Agent",
    description="AI agent for multimodal persona simulation using Google Gemini",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Vertex AI Initialization ---
PROJECT_ID = os.environ.get("GCLOUD_PROJECT")
LOCATION = os.environ.get("GCLOUD_LOCATION", "us-central1")

# Initialize Vertex AI
if PROJECT_ID:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    # Use Gemini 1.5 Pro for multimodal capabilities
    model = GenerativeModel("gemini-1.5-pro")
else:
    print("WARNING: GCLOUD_PROJECT not set. API calls will fail.")
    model = None


def construct_prompt(user_prompt: str, brand_context: str, audience_summary: str) -> str:
    """
    Constructs the system prompt for the Gemini model.

    Args:
        user_prompt: User's question
        brand_context: Brand information
        audience_summary: Persona description

    Returns:
        Formatted prompt string
    """
    prompt_template = '''You are a creative testing and surveying chatbot acting as a specific consumer persona.
Your persona is defined by the following summary:
---
**Audience Persona:**
{audience_summary}
---

You are being asked for feedback on a brand. Here is the context for the brand:
---
**Brand Context:**
{brand_context}
---

Now, please respond to the following question or statement from the user, keeping your persona and the brand context in mind at all times. Be authentic, detailed, and stay in character.

**User's Question:** "{user_prompt}"
'''

    return prompt_template.format(
        audience_summary=audience_summary,
        brand_context=brand_context,
        user_prompt=user_prompt
    )


@app.get("/")
def read_root():
    """Health check endpoint."""
    return {
        "status": "Synthetic Persona Agent is running",
        "version": "1.0.0",
        "multimodal": True
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint for monitoring.

    Returns:
        Health status and configuration info
    """
    return {
        "status": "healthy",
        "project_id": PROJECT_ID,
        "location": LOCATION,
        "model_configured": model is not None
    }


@app.post("/chat", response_model=ChatResponse)
async def chat_handler(request: ChatRequest):
    """
    Handles text-only chat requests.

    Args:
        request: ChatRequest with user prompt, brand context, and audience summary

    Returns:
        ChatResponse with the agent's persona-based reply

    Raises:
        HTTPException: If the model is not configured or generation fails
    """
    if not model:
        raise HTTPException(
            status_code=500,
            detail="Model not configured. Set GCLOUD_PROJECT environment variable."
        )

    try:
        # Construct the prompt
        prompt = construct_prompt(
            request.user_prompt,
            request.brand_context,
            request.audience_summary
        )

        # Generate content
        response = model.generate_content([prompt])

        return ChatResponse(agent_response=response.text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@app.post("/chat/multimodal", response_model=ChatResponse)
async def multimodal_chat_handler(
    user_prompt: str = Form(...),
    brand_context: str = Form(...),
    audience_summary: str = Form(...),
    image: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None)
):
    """
    Handles multimodal chat requests with text, images, and/or videos.

    This endpoint supports the full multimodal capabilities of Gemini,
    allowing users to upload visual content alongside their text prompts.

    Args:
        user_prompt: The user's question or statement
        brand_context: Context about the brand
        audience_summary: Description of the persona
        image: Optional image file
        video: Optional video file

    Returns:
        ChatResponse with the agent's persona-based reply

    Raises:
        HTTPException: If the model is not configured or generation fails
    """
    if not model:
        raise HTTPException(
            status_code=500,
            detail="Model not configured. Set GCLOUD_PROJECT environment variable."
        )

    try:
        # Construct the text prompt
        prompt_text = construct_prompt(user_prompt, brand_context, audience_summary)

        # Build the content list for Gemini
        content_parts = [prompt_text]

        # Add image if provided
        if image:
            image_data = await image.read()
            image_part = Part.from_data(
                data=image_data,
                mime_type=image.content_type or "image/jpeg"
            )
            content_parts.append(image_part)

        # Add video if provided
        if video:
            video_data = await video.read()
            video_part = Part.from_data(
                data=video_data,
                mime_type=video.content_type or "video/mp4"
            )
            content_parts.append(video_part)

        # Generate content with multimodal input
        response = model.generate_content(content_parts)

        return ChatResponse(agent_response=response.text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Multimodal generation failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
