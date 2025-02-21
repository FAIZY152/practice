"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  ImageIcon,
  Code,
  SearchCode,
} from "lucide-react";

import Image from "next/image";
import UsageProgress from "../other/UsageProgress";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    href: "/images",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    href: "/code",
  },
  {
    label: "Background Remover",
    icon: ImageIcon,
    color: "text-orange-700",
    href: "/remover",
  },
  {
    label: "Code Analyser",
    icon: SearchCode,
    color: "text-yellow-600",
    href: "/codeReviwer",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14 gap-3">
          <Image src="/vercel.svg" alt="Genius AI" width={20} height={20} />
          <h1 className="text-2xl font-bold">All in One AI</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition ${
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              }`}>
              <div className="flex items-center flex-1">
                <route.icon className={`h-5 w-5 mr-3 ${route.color}`} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3">
        <UsageProgress />
      </div>
    </div>
  );
}
