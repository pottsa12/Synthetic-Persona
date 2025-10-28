"use client";

import { useState, useRef } from "react";
import AudienceSelector from "../components/AudienceSelector";
import { Database } from "../lib/database.types";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Upload, Send, Image as ImageIcon, Video } from "lucide-react";

type Audience = Database["public"]["Tables"]["audiences"]["Row"];

interface ChatMessage {
  sender: "user" | "agent";
  text: string;
  image?: string;
  video?: string;
}

export default function Home() {
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null);
  const [brandContext, setBrandContext] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // File upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      const reader = new FileReader();
      reader.onload = () => setVideoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearAttachments = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    setImagePreview(null);
    setVideoPreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedAudience) {
      alert("Please select an audience and enter a message.");
      return;
    }

    // Add user message to chat
    const userMessage: ChatMessage = {
      sender: "user",
      text: currentMessage,
      image: imagePreview || undefined,
      video: videoPreview || undefined,
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Clear inputs
    const messageCopy = currentMessage;
    setCurrentMessage("");

    try {
      const formData = new FormData();
      formData.append("user_prompt", messageCopy);
      formData.append("brand_context", brandContext);
      formData.append("audience_summary", selectedAudience.audience_summary || "A general consumer.");

      if (selectedImage) formData.append("image", selectedImage);
      if (selectedVideo) formData.append("video", selectedVideo);

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      const agentMessage: ChatMessage = { sender: "agent", text: data.agent_response };
      setChatHistory((prev) => [...prev, agentMessage]);

      // Clear attachments after successful send
      clearAttachments();
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        sender: "agent",
        text: "Sorry, I encountered an error. Please try again.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Synthetic Personas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Chat with AI-powered consumer personas
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Configuration Section */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Persona</CardTitle>
            </CardHeader>
            <CardContent>
              <AudienceSelector onAudienceSelect={setSelectedAudience} />
              {selectedAudience && (
                <p className="text-xs text-muted-foreground mt-2">
                  Selected: <span className="font-medium">{selectedAudience.audience_name}</span>
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Context</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={brandContext}
                onChange={(e) => setBrandContext(e.target.value)}
                placeholder="Describe the brand or product you want feedback on..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Chat Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Chat History */}
            <div className="border rounded-lg h-[400px] overflow-y-auto p-4 mb-4 bg-muted/20">
              {chatHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  Select a persona and start the conversation...
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      {msg.image && (
                        <img src={msg.image} alt="User upload" className="mt-2 rounded max-w-full h-auto" />
                      )}
                      {msg.video && (
                        <video src={msg.video} controls className="mt-2 rounded max-w-full h-auto" />
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-lg p-3 text-sm">
                    Agent is typing...
                  </div>
                </div>
              )}
            </div>

            {/* File Attachments Preview */}
            {(imagePreview || videoPreview) && (
              <div className="flex gap-2 mb-2 p-2 border rounded-lg bg-muted/50">
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded" />
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        if (imageInputRef.current) imageInputRef.current.value = "";
                      }}
                      className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
                {videoPreview && (
                  <div className="relative">
                    <video src={videoPreview} className="h-16 w-16 object-cover rounded" />
                    <button
                      onClick={() => {
                        setSelectedVideo(null);
                        setVideoPreview(null);
                        if (videoInputRef.current) videoInputRef.current.value = "";
                      }}
                      className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
                id="video-upload"
              />

              <Button
                variant="outline"
                size="icon"
                onClick={() => imageInputRef.current?.click()}
                title="Upload Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => videoInputRef.current?.click()}
                title="Upload Video"
              >
                <Video className="h-4 w-4" />
              </Button>

              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask a question or share content..."
                className="flex-1 min-h-[60px] resize-none"
              />

              <Button onClick={handleSendMessage} disabled={isLoading} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
