"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  ImageIcon,
  Code,
  SearchCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UsageProgress from "../other/UsageProgress";
import { usePathname } from "next/navigation"; // ✅ Correct import (App Router)

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

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
        setIsCollapsed(true);
      } else {
        setIsOpen(true);
        setIsCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Toggle button for mobile - fixed position */}
      {isMobile && !isOpen && (
        <Button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 size-10 p-0 rounded-full bg-[#111827] text-white hover:bg-[#1e293b] transition-all duration-300 shadow-lg"
          aria-label="Open sidebar">
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative h-full z-50 transition-all duration-300 ease-in-out",
          isMobile
            ? isOpen
              ? "left-0 animate-sidebar-slide-in"
              : "-left-[280px]"
            : isCollapsed
            ? "w-[80px]"
            : "w-[280px]",
          "space-y-4 py-4 flex flex-col bg-[#111827] text-white",
          className
        )}>
        <div className="px-3 py-2 flex-1">
          {/* Logo area with toggle button */}
          <div className="flex items-center justify-between mb-10 pl-3 pr-1">
            <a href="/dashboard" className="flex items-center gap-3">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500 to-blue-600 rounded-full opacity-90"></div>
                <span className="relative text-white font-bold text-sm">
                  AI
                </span>
              </div>
              {!isCollapsed && (
                <h1 className="text-xl font-bold truncate">All in One AI</h1>
              )}
            </a>

            {/* Toggle button for desktop */}
            {!isMobile && (
              <Button
                onClick={toggleSidebar}
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full hover:bg-white/10"
                aria-label={
                  isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }>
                {isCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            {routes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                className={cn(
                  "flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200",
                  pathname === route.href
                    ? "text-white bg-white/10"
                    : "text-zinc-400",
                  isCollapsed ? "justify-center" : ""
                )}>
                <div
                  className={cn(
                    "flex items-center",
                    isCollapsed ? "flex-col gap-1" : "flex-row gap-3"
                  )}>
                  <route.icon className={cn("h-5 w-5", route.color)} />
                  {!isCollapsed && (
                    <span className="text-sm">{route.label}</span>
                  )}
                  {isCollapsed && (
                    <span className="text-[10px] opacity-80">
                      {route.label.split(" ")[0]}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Usage progress */}
        <div className={cn("px-3", isCollapsed ? "mx-auto" : "")}>
          <UsageProgress />
        </div>

        {/* Close button for mobile only */}
        {isMobile && isOpen && (
          <Button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 size-8 p-0 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
