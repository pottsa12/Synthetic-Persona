import { NextResponse } from "next/server";

// Vercel serverless function configuration
export const maxDuration = 60; // Maximum duration in seconds (Vercel Pro)
export const runtime = 'nodejs'; // Use Node.js runtime

export async function POST(request: Request) {
  try {
    // Validate request size (prevent overload)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Request too large. Maximum 100MB.' },
        { status: 413 }
      );
    }

    const formData = await request.formData();

    const user_prompt = formData.get("user_prompt") as string;
    const brand_context = formData.get("brand_context") as string;
    const audience_summary = formData.get("audience_summary") as string;
    const image = formData.get("image") as File | null;
    const video = formData.get("video") as File | null;

    const agentUrl = process.env.AI_AGENT_URL;

    if (!agentUrl) {
      return NextResponse.json(
        { error: "AI agent service is not configured." },
        { status: 500 }
      );
    }

    // Build the FormData for the AI agent
    const agentFormData = new FormData();
    agentFormData.append("user_prompt", user_prompt);
    agentFormData.append("brand_context", brand_context);
    agentFormData.append("audience_summary", audience_summary);

    if (image) {
      agentFormData.append("image", image);
    }

    if (video) {
      agentFormData.append("video", video);
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55s (under 60s limit)

    try {
      // Call the multimodal endpoint with timeout
      const agentResponse = await fetch(`${agentUrl}/chat/multimodal`, {
        method: "POST",
        body: agentFormData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!agentResponse.ok) {
        const errorText = await agentResponse.text();
        console.error("Error from agent:", errorText);
        return NextResponse.json(
          { error: "Failed to get response from AI agent" },
          { status: agentResponse.status }
        );
      }

      const data = await agentResponse.json();

      // Return with cache control headers
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'no-store', // Don't cache dynamic AI responses
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 504 }
        );
      }

      throw fetchError;
    }
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
