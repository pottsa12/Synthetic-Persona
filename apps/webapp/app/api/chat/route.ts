import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const user_prompt = formData.get("user_prompt") as string;
    const brand_context = formData.get("brand_context") as string;
    const audience_summary = formData.get("audience_summary") as string;
    const image = formData.get("image") as File | null;
    const video = formData.get("video") as File | null;

    const agentUrl = process.env.AI_AGENT_URL;

    if (!agentUrl) {
      throw new Error("AI_AGENT_URL is not configured.");
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

    // Call the multimodal endpoint
    const agentResponse = await fetch(`${agentUrl}/chat/multimodal`, {
      method: "POST",
      body: agentFormData,
    });

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error("Error from agent:", errorText);
      return NextResponse.json(
        { error: "Failed to get response from agent" },
        { status: 500 }
      );
    }

    const data = await agentResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
