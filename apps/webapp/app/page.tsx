"use client";

import { useState, useRef } from "react";
import AudienceSelector from "../components/AudienceSelector";
import { Database } from "../lib/database.types";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Upload, Send, Image as ImageIcon, Video, X } from "lucide-react";

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
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <h1 className="text-3xl font-bold text-tombras-dark">
            Synthetic Personas
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Chat with AI-powered consumer personas
          </p>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Configuration Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold text-tombras-dark">
                Select Persona
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <AudienceSelector onAudienceSelect={setSelectedAudience} />
              {selectedAudience && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Selected Persona:</p>
                  <p className="text-sm font-semibold text-tombras-dark">
                    {selectedAudience.audience_name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg font-semibold text-tombras-dark">
                Brand Context
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                value={brandContext}
                onChange={(e) => setBrandContext(e.target.value)}
                placeholder="Describe the brand or product you want feedback on..."
                className="min-h-[120px] border-gray-300 focus:border-primary focus:ring-primary"
              />
            </CardContent>
          </Card>
        </div>

        {/* Chat Section */}
        <Card className="border-gray-200 shadow-lg">
          <CardHeader className="border-b border-gray-100 bg-white">
            <CardTitle className="text-lg font-semibold text-tombras-dark">
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Chat History */}
            <div className="h-[500px] overflow-y-auto p-6 bg-white">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Select a persona and start the conversation...</p>
                  <p className="text-sm text-gray-400 mt-2">Share text, images, or videos to get feedback</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
                          msg.sender === "user"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-900 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="User upload"
                            className="mt-3 rounded-lg max-w-full h-auto border border-gray-200"
                          />
                        )}
                        {msg.video && (
                          <video
                            src={msg.video}
                            controls
                            className="mt-3 rounded-lg max-w-full h-auto border border-gray-200"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                          <span className="text-sm text-gray-600">Agent is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              {/* File Attachments Preview */}
              {(imagePreview || videoPreview) && (
                <div className="flex gap-3 mb-4 p-3 bg-white border border-gray-200 rounded-lg">
                  {imagePreview && (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          if (imageInputRef.current) imageInputRef.current.value = "";
                        }}
                        className="absolute -top-2 -right-2 bg-primary hover:bg-primary/90 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md transition-all"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {videoPreview && (
                    <div className="relative group">
                      <video
                        src={videoPreview}
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setSelectedVideo(null);
                          setVideoPreview(null);
                          if (videoInputRef.current) videoInputRef.current.value = "";
                        }}
                        className="absolute -top-2 -right-2 bg-primary hover:bg-primary/90 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md transition-all"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 items-end">
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
                  className="h-11 w-11 border-gray-300 hover:border-primary hover:text-primary transition-colors"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => videoInputRef.current?.click()}
                  title="Upload Video"
                  className="h-11 w-11 border-gray-300 hover:border-primary hover:text-primary transition-colors"
                >
                  <Video className="h-5 w-5" />
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
                  className="flex-1 min-h-[44px] max-h-[120px] resize-none border-gray-300 focus:border-primary focus:ring-primary rounded-xl"
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !currentMessage.trim() || !selectedAudience}
                  size="icon"
                  className="h-11 w-11 bg-primary hover:bg-primary/90 disabled:bg-gray-300 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
