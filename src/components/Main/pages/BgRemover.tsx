"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import LoadingComp from "./Loader";
import useUserStore from "@/store/UserStore";

export default function BackgroundRemover() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, setUsageCount, usageCount } = useUserStore.getState();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!image) return;

    setLoading(true);

    if (!user?.id) {
      alert("Please log in to continue.");
      return;
    }

    // ✅ Append userId to FormData
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("image", image);

    try {
      const response = await fetch("/api/remove-background", {
        method: "POST",
        body: formData,
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
        setProcessedImage(data.imageUrl); // Show the processed image URL
      }
    } catch (error) {
      console.error("Error removing background:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Background Remover
      </h1>
      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file:mr-4 file:py-1  file:px-4 file:rounded-full file:border-0  file:text-sm file:font-semibold file:bg-violet-50 file:text-[#C2410C] hover:file:bg-violet-100"
        />
        {preview && (
          <div className="mt-4">
            <Image
              src={preview}
              alt="Processed Image"
              width={300}
              height={300}
              className="object-contain"
              unoptimized
            />
          </div>
        )}
        <Button
          className="w-full bg-[#C2410C] hover:bg-[#C2410C]/80 shadow-md"
          onClick={handleRemoveBackground}
          disabled={!image}>
          Remove Background
        </Button>

        {loading && <LoadingComp />}
        {processedImage && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-green-600">
              Background Removed!
            </h2>
            <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-md border bg-white">
              <Image
                src={processedImage}
                alt="Processed Image"
                fill
                className="object-contain"
              />
            </div>
            <a
              href={processedImage}
              download="background-removed.png"
              className="text-blue-600 hover:underline  ">
              <div className="flex items-center gap-2 justify-center">
                <Button className="bg-[#C2410C] hover:bg-[#C2410C]/80 shadow-md">
                  Download Image
                </Button>
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
