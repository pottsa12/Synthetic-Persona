"""
Synthetic Persona Agent - FastAPI Server with Gemini Multimodal Support

This agent simulates consumer personas using Google's Gemini model.
Supports text, images, and video inputs for rich brand feedback.
"""

import os
import base64
import uuid
from datetime import timedelta, datetime
from typing import Optional, List
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from google.cloud import storage
from google.auth import compute_engine, iam
from google.auth.transport import requests as auth_requests
import google.auth
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Pydantic Models for API ---
class ChatMessage(BaseModel):
    """
    Model for a single chat message in conversation history.

    Args:
        sender: Either 'user' or 'agent'
        text: The message content
    """
    sender: str
    text: str


class ChatRequest(BaseModel):
    """
    Chat request model for text-only interactions with optional history and image.

    Args:
        user_prompt: The user's question or statement
        brand_context: Context about the brand being discussed
        audience_summary: Description of the persona to embody
        history: Optional list of previous chat messages for session memory
        image_data: Optional Base64-encoded image data for multimodal analysis
    """
    user_prompt: str
    brand_context: str
    audience_summary: str
    history: Optional[List[ChatMessage]] = None
    image_data: Optional[str] = None


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
    # Use Gemini 2.5 Pro for multimodal capabilities (latest model)
    model = GenerativeModel("gemini-2.5-pro")
else:
    print("WARNING: GCLOUD_PROJECT not set. API calls will fail.")
    model = None


def construct_prompt(user_prompt: str, brand_context: str, audience_summary: str) -> str:
    """
    Constructs the system prompt for the Gemini model (legacy function for backward compatibility).

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


def construct_prompt_with_history(
    user_prompt: str,
    brand_context: str,
    audience_summary: str,
    history: Optional[List[ChatMessage]] = None
) -> str:
    """
    Constructs a prompt with conversation history for session memory.

    Args:
        user_prompt: User's current question
        brand_context: Brand information
        audience_summary: Persona description
        history: Optional list of previous chat messages

    Returns:
        Formatted prompt string with conversation history
    """
    # Start with the system instructions
    full_prompt = f"""You are a creative testing and surveying chatbot acting as a specific consumer persona.
Your persona is defined by: {audience_summary}

You are being asked for feedback on a brand. The brand context is: {brand_context}

Keep your persona and the brand context in mind at all times. Be authentic, detailed, and stay in character.

--- Begin Conversation History ---
"""

    # Add conversation history if provided
    if history:
        for message in history:
            if message.sender == 'user':
                full_prompt += f"User: {message.text}\n"
            else:
                full_prompt += f"Agent: {message.text}\n"

    # Add the current user message
    full_prompt += f"User: {user_prompt}\n"
    full_prompt += "Agent: "  # Prompt the agent to respond

    return full_prompt


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


class SignedUrlRequest(BaseModel):
    """
    Request model for generating signed upload URLs.

    Args:
        filename: Original filename of the video to upload
        content_type: MIME type of the video (e.g., 'video/mp4')
    """
    filename: str
    content_type: str


class SignedUrlResponse(BaseModel):
    """
    Response model containing signed URL and GCS URI.

    Args:
        upload_url: Signed URL for uploading the video
        gcs_uri: GCS URI to use when referencing the uploaded file
        blob_name: Name of the blob in GCS
    """
    upload_url: str
    gcs_uri: str
    blob_name: str


@app.post("/generate-upload-url", response_model=SignedUrlResponse)
async def generate_upload_url(request: SignedUrlRequest):
    """
    Generates a signed URL for uploading large videos directly to GCS.

    This endpoint creates a unique blob name and generates a signed URL
    that allows the frontend to upload files directly to Google Cloud Storage.
    The signed URL is valid for 15 minutes.

    Uses IAM-based signing which works with Cloud Run's default credentials
    without requiring a service account key file.

    Args:
        request: SignedUrlRequest with filename and content type

    Returns:
        SignedUrlResponse with upload URL, GCS URI, and blob name

    Raises:
        HTTPException: If URL generation fails
    """
    try:
        # Get the default credentials and create an IAM signer
        credentials, project = google.auth.default()

        # Get service account email
        service_account_email = f"{os.getenv('GCLOUD_PROJECT_NUMBER', '179579890817')}-compute@developer.gserviceaccount.com"

        # Create IAM request object for signing
        auth_request = auth_requests.Request()

        # Create IAM signer for signing the URL
        signing_credentials = iam.Signer(
            request=auth_request,
            credentials=credentials,
            service_account_email=service_account_email
        )

        # Initialize GCS client with default credentials
        storage_client = storage.Client(project=PROJECT_ID)
        bucket = storage_client.bucket("synthetic-personas-videos")

        # Generate unique blob name using UUID
        file_extension = request.filename.split('.')[-1] if '.' in request.filename else 'mp4'
        blob_name = f"{uuid.uuid4()}.{file_extension}"
        blob = bucket.blob(blob_name)

        # Generate signed URL using IAM-based signing (valid for 15 minutes)
        # Pass signing_credentials directly to generate_signed_url
        upload_url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(minutes=15),
            method="PUT",
            content_type=request.content_type,
            credentials=signing_credentials
        )

        # Construct GCS URI for Gemini
        gcs_uri = f"gs://synthetic-personas-videos/{blob_name}"

        return SignedUrlResponse(
            upload_url=upload_url,
            gcs_uri=gcs_uri,
            blob_name=blob_name
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate upload URL: {str(e)}"
        )


@app.post("/chat", response_model=ChatResponse)
async def chat_handler(request: ChatRequest):
    """
    Handles chat requests with optional session memory and multimodal image support.

    Args:
        request: ChatRequest with user prompt, brand context, audience summary,
                optional conversation history, and optional image data

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
        # Construct the text prompt with conversation history
        text_prompt = construct_prompt_with_history(
            request.user_prompt,
            request.brand_context,
            request.audience_summary,
            request.history
        )

        # Start with the text prompt
        prompt_parts = [text_prompt]

        # Add image if provided (Base64 encoded)
        if request.image_data:
            try:
                # The Base64 string is prefixed with "data:image/[type];base64,"
                # We need to strip that prefix before decoding
                if "," in request.image_data:
                    header, base64_data = request.image_data.split(",", 1)
                    # Extract mime type from header (e.g., "data:image/jpeg;base64")
                    if ":" in header and ";" in header:
                        mime_type = header.split(":")[1].split(";")[0]
                    else:
                        mime_type = "image/jpeg"  # Default
                else:
                    # No header, assume raw base64
                    base64_data = request.image_data
                    mime_type = "image/jpeg"

                # Decode and create image part
                image_bytes = base64.b64decode(base64_data)
                image_part = Part.from_data(
                    mime_type=mime_type,
                    data=image_bytes
                )
                prompt_parts.append(image_part)

            except Exception as e:
                print(f"Error processing image data: {e}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid image data: {str(e)}"
                )

        # Generate content (text-only or multimodal)
        response = model.generate_content(prompt_parts)

        return ChatResponse(agent_response=response.text)

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@app.options("/chat/multimodal")
async def multimodal_options():
    """Handle CORS preflight for multimodal endpoint."""
    from fastapi.responses import Response
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )


@app.post("/chat/multimodal", response_model=ChatResponse)
async def multimodal_chat_handler(
    user_prompt: str = Form(...),
    brand_context: str = Form(...),
    audience_summary: str = Form(...),
    history: Optional[str] = Form(None),  # JSON string of chat history
    image: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None),
    video_uri: Optional[str] = Form(None)  # GCS URI for large videos
):
    """
    Handles multimodal chat requests with text, images, and/or videos.

    This endpoint supports the full multimodal capabilities of Gemini,
    allowing users to upload visual content alongside their text prompts.
    For videos larger than 30MB, use the video_uri parameter with a GCS URI
    obtained from /generate-upload-url endpoint.

    Args:
        user_prompt: The user's question or statement
        brand_context: Context about the brand
        audience_summary: Description of the persona
        history: Optional JSON string of conversation history
        image: Optional image file
        video: Optional video file (for videos < 30MB)
        video_uri: Optional GCS URI for large videos (for videos >= 30MB)

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
        # Parse history if provided
        history_list = None
        if history:
            import json
            try:
                history_data = json.loads(history)
                # Convert to ChatMessage objects
                history_list = [ChatMessage(**msg) for msg in history_data]
            except Exception as e:
                print(f"Error parsing history: {e}")
                # Continue without history if parsing fails

        # Construct the text prompt with history support
        prompt_text = construct_prompt_with_history(
            user_prompt,
            brand_context,
            audience_summary,
            history_list
        )

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

        # Add video if provided (either as file upload or GCS URI)
        if video_uri:
            # Use GCS URI for large videos (>30MB)
            video_part = Part.from_uri(
                uri=video_uri,
                mime_type="video/mp4"  # Default to mp4, adjust if needed
            )
            content_parts.append(video_part)
        elif video:
            # Use direct upload for smaller videos (<30MB)
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
