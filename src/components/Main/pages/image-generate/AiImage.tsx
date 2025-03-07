"use client";

import type React from "react";

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
    setImageUrl(null);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId: user?.id }),
        cache: "no-cache",
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (usageCount >= 5) {
        window.location.href = "/pricing";
        return;
      }

      setUsageCount(usageCount + 1);

      // ✅ Step 1: Wait for Image to be Available
      const checkImage = async (url: string, retries = 5) => {
        for (let i = 0; i < retries; i++) {
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) return true;
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s
        }
        return false;
      };

      const isReady = await checkImage(data.url);
      if (isReady) {
        setImageUrl(data.url);
      } else {
        throw new Error("Image is not ready yet. Try again.");
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
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-pink-50 flex items-center justify-center">
          <PictureInPicture className="w-5 h-5 sm:w-6 sm:h-6 text-[#BE185D]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#BE185D]">
            AI Image Generator
          </h1>
          <p className="text-xs sm:text-sm text-[#BE185D]/80">
            Generate images using the OpenAI API.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleGenerateImage}
        className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your image description..."
          className="flex-1 h-10 sm:h-12 bg-white shadow-sm border-0 focus-visible:ring-pink-500"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-[#BE185D] hover:bg-[#BE185D]/80 shadow-sm h-10 sm:h-12 px-4 sm:px-6 whitespace-nowrap">
          {loading ? "Generating..." : "Generate"}
        </Button>
      </form>

      {/* Display States */}
      <div className="min-h-[300px] flex items-center justify-center">
        {loading ? (
          <LoadingComp />
        ) : !imageUrl ? (
          <div className="w-full">
            <EmptyState
              actionLabel="Generate Image"
              title="Image Generation"
              description="Generate images of anything you imagine."
            />
          </div>
        ) : (
          <div className="w-full space-y-4 transition-all duration-300 ease-in-out">
            <div className="relative aspect-square max-w-md mx-auto rounded-lg overflow-hidden bg-gray-100 shadow-lg border border-pink-100 hover:shadow-xl transition-shadow duration-300">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Generated Image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <Button
              onClick={handleDownload}
              className="w-full max-w-md mx-auto flex items-center justify-center gap-2 bg-[#BE185D] hover:bg-[#BE185D]/90 text-white rounded-md py-2 sm:py-3 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download Image</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
