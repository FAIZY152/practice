"use client";

// import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function DashboardPage() {
  const tools = useMemo(
    () => [
      {
        label: "Conversation",
        icon: "💭",
        href: "/conversation",
        color: "bg-violet-500/10",
      },
      {
        label: "Image Generation",
        icon: "🖼️",
        href: "/images",
        color: "bg-pink-700/10",
      },

      {
        label: "Code Generation",
        icon: "👨‍💻",
        href: "/code",
        color: "bg-[#CCFBF1]",
      },

      {
        label: "Background Remover",
        icon: "🖼️",
        href: "/remover",
        color: "bg-green-700/10",
      },
      {
        label: "Code Analyzer",
        icon: "👨‍💻",
        href: "/codeReviwer",
        color: "bg-orange-700/10",
      },
    ],
    []
  );
  return (
    <div className="p-4 space-y-6">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with the smartest AI - Experience the power of AI
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Link
            href={tool.href}
            prefetch={true}
            key={tool.href}
            className={`p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer rounded-lg ${tool.color}`}>
            <div className="flex items-center gap-x-4">
              <div className="p-2 w-fit rounded-md">{tool.icon}</div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            {/* <ArrowRight className="w-5 h-5" /> */}
          </Link>
        ))}
      </div>
    </div>
  );
}
