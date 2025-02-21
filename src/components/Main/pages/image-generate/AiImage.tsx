"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "../Empty";
import LoadingComp from "../Loader";
import useUserStore from "@/store/UserStore";

// Lazy load heavy dependencies
const PictureInPicture = dynamic(
  () => import("lucide-react").then((mod) => mod.PictureInPicture),
  { ssr: false }
);
const Download = dynamic(
  () => import("lucide-react").then((mod) => mod.Download),
  { ssr: false }
);

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, setUsageCount, usageCount } = useUserStore.getState();

  // Handle input changes without excessive re-renders
  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrompt(e.target.value);
    },
    []
  );

  // Handle image generation
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId: user?.id }),
        cache: "no-cache",
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (
        data.error === "Free limit reached, please upgrade" ||
        usageCount >= 5
      ) {
        window.location.href = "/pricing"; // 🚀 Redirect to upgrade page
      } else {
        setUsageCount(usageCount + 1);
        setImageUrl(data.url);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image download
  const handleDownload = useCallback(async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-image.png";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  }, [imageUrl]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
          <PictureInPicture className="w-6 h-6 text-[#BE185D]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#BE185D]">
            AI Image Generator
          </h1>
          <p className="text-sm text-[#BE185D]">
            Generate images using the OpenAI API.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerateImage} className="flex gap-2">
        <Input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your image description..."
          className="flex-1"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-[#BE185D] hover:bg-[#BE185D]/80 shadow-sm">
          {loading ? "Generating..." : "Generate"}
        </Button>
      </form>

      {/* Display States */}
      {loading ? (
        <LoadingComp />
      ) : !imageUrl ? (
        <EmptyState
          actionLabel="Generate Image"
          title="Image Generation"
          description="Generate images of anything you imagine."
        />
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-lg">
            <Image
              src={imageUrl}
              alt="Generated Image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <Button
            onClick={handleDownload}
            className="w-full bg-[#BE185D] text-white rounded-md">
            <Download className="mr-2 h-4 w-4" /> Download Image
          </Button>
        </div>
      )}
    </div>
  );
}
