import { Download } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GeneratedImage } from "./types/image";

interface ImageGridProps {
  images: GeneratedImage[];
}

export function ImageGrid({ images }: ImageGridProps) {
  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group rounded-lg overflow-hidden">
            <Image
              src={image.url}
              alt={image.prompt}
              width={400}
              height={400}
              className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
              <p className="text-white text-sm text-center line-clamp-2">
                {image.prompt}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={() => handleDownload(image)}>
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
