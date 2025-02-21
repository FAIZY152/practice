"use client";
import { useState } from "react";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateVideo = async () => {
    setLoading(true);
    setVideoUrl(null);

    const response = await fetch("/api/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data.videoUrl) {
      setVideoUrl(data.videoUrl);
      setLoading(false);
      console.log("Video generation response:", data);
      
    } else {
      console.error("Error:", data.error);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Enter your video idea..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button onClick={generateVideo} className="mt-2 p-2 bg-blue-500 text-white rounded">
        {loading ? "Generating..." : "Generate Video"}
      </button>

      {videoUrl && (
        <video controls className="mt-4 w-full">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support videos.
        </video>
      )}
    </div>
  );
}
