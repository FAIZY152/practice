"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export default function BotAvatar() {
  return (
    <Avatar className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
      <div className="absolute inset-0 flex items-center justify-center">
        <Bot className="w-6 h-6 text-white bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse" />
      </div>
      <AvatarImage src="/bot-avatar.png" alt="AI Bot" className="hidden" />
      <AvatarFallback className="text-white font-semibold">AI</AvatarFallback>
    </Avatar>
  );
}
