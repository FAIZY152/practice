"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Image,
  Code,
  Check,
  ImageIcon,
  SearchCode,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: MessageSquare,
    name: "Conversation",
    color: "text-purple-500",
  },
  {
    icon: Image,
    name: "Image Generation",
    color: "text-pink-500",
  },
  {
    name: "Background Remover",
    icon: ImageIcon,
    color: "text-orange-700",
  },
  {
    name: "Code Analyser",
    icon: SearchCode,
    color: "text-yellow-600",
  },
  {
    icon: Code,
    name: "Code Generation",
    color: "text-blue-500",
  },
];

interface UpgradeDialogProps {
  open: boolean;
  setopen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpgradeDialog({ open, setopen }: UpgradeDialogProps) {
  const router = useRouter();
  const handleRouter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/pricing");
    setopen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            Upgrade to Genius
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 hover:bg-purple-100">
              PRO
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg border p-3 shadow-sm">
              <div className={`${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="flex-1 text-sm font-medium">{feature.name}</div>
              <Check className="h-5 w-5 text-purple-600" />
            </div>
          ))}
        </div>

        <Button
          onClick={handleRouter}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
          Upgrade
          <div className="ml-2">⚡</div>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
