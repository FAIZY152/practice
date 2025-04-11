"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
// import dynamic from "next/dynamic";
import useUserStore from "@/store/UserStore";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Lazy load large dependencies to reduce initial load time
// const BotAvatar = dynamic(() => import("../other/BotAvatar"), { ssr: false });
// const Loader = dynamic(() => import("./Loader"), { ssr: false });

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AICoachUi() {
  const { userid, setUsageCount, usageCount } = useUserStore.getState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // You can fetch from auth later
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/coach-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userid, newMessages }),
      });

      const res_data = await res.json();

      // Check for API errors
      if (res_data.error) {
        toast.error(res_data.error);

        // Check if user reached free limit
        if (
          res_data.error === "Free limit reached, please upgrade" ||
          usageCount >= 5
        ) {
          window.location.href = "/pricing";
        }
        return;
      }

      // Process successful response
      if (res_data.content) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: res_data.content },
        ]);
        setUsageCount(usageCount + 1);
        toast.success("Message sent successfully!");
      } else {
        toast.error("No response from AI coach");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error:", errorMessage);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    // Split content into sections based on double newlines
    const sections = content.split("\n\n").filter(Boolean);

    // Helper function to process section content
    const processSectionContent = (text: string, headingToRemove: string) => {
      return text.replace(headingToRemove, "").trim();
    };

    return (
      <div className="space-y-6">
        {sections.map((section, index) => {
          // Check for any heading pattern: **Heading:**
          const headingMatch = section.match(/^\*\*(.*?):\*\*/);

          if (headingMatch) {
            // Extract the section name from the heading match
            const sectionName = headingMatch[1].trim();
            const contentText = processSectionContent(section, headingMatch[0]);
            const lines = contentText.split("\n");

            // Special handling for Analysis section (usually just text)
            if (sectionName.toLowerCase() === "analysis") {
              return (
                <div key={index} className="space-y-2">
                  <h2 className="text-lg font-bold text-green-700">
                    Analysis:
                  </h2>
                  <p className="text-black font-normal">{contentText}</p>
                </div>
              );
            }

            // Special handling for Guidance section (usually bullet points)
            if (sectionName.toLowerCase() === "guidance") {
              const bulletPoints = lines.filter((line) => line.trim());

              return (
                <div key={index} className="space-y-3">
                  <h2 className="text-lg font-bold text-green-700">
                    Guidance:
                  </h2>
                  <div className="space-y-2 pl-1">
                    {bulletPoints.map((point, i) => {
                      // Handle bullet points
                      if (point.trim().startsWith("*")) {
                        const bulletContent = point.replace("*", "").trim();

                        return (
                          <div key={i} className="flex items-start gap-2">
                            <span className="h-2 w-2 mt-2 rounded-full bg-green-400" />
                            <span className="text-black font-normal">
                              {bulletContent}
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <p key={i} className="text-black font-normal">
                            {point}
                          </p>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            }

            // Special handling for Action Steps section (numbered steps)
            if (sectionName.toLowerCase() === "action steps") {
              const bulletPoints = lines.filter((line) => line.trim());

              return (
                <div key={index} className="space-y-3">
                  <h2 className="text-lg font-bold text-green-700">
                    Action Steps:
                  </h2>
                  <div className="space-y-2 pl-1">
                    {bulletPoints.map((point, i) => {
                      // Handle bullet points
                      if (point.trim().startsWith("*")) {
                        const bulletContent = point.replace("*", "").trim();

                        return (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-green-800">
                                {i + 1}
                              </span>
                            </div>
                            <span className="text-black font-normal">
                              {bulletContent}
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <p key={i} className="text-black font-normal">
                            {point}
                          </p>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            }

            // Generic heading handling for other section types
            return (
              <div key={index} className="space-y-2">
                <h2 className="text-lg font-bold text-green-700">
                  {sectionName}:
                </h2>
                <p className="text-black font-normal">{contentText}</p>
              </div>
            );
          }

          // Look for any other heading pattern like **Something:**
          if (section.match(/^\*\*.*?\*\*/) && section.includes(":")) {
            // This is a custom heading with content after the colon
            const parts = section.split(":");
            const heading = parts[0].replace(/\*\*/g, "").trim();
            const contentText = parts.slice(1).join(":").trim();

            return (
              <div key={index} className="space-y-2">
                <h2 className="text-lg font-bold text-green-700">{heading}:</h2>
                <p className="text-black font-normal">{contentText}</p>
              </div>
            );
          }

          // Handle multi-line content with potential bullet points
          if (section.includes("\n")) {
            const lines = section.split("\n");
            return (
              <div key={index} className="space-y-2">
                {lines.map((line, i) => {
                  // Handle bullet points
                  if (line.trim().startsWith("*")) {
                    const bulletContent = line.replace("*", "").trim();
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <span className="h-2 w-2 mt-2 rounded-full bg-green-400" />
                        <span className="text-black font-normal">
                          {bulletContent}
                        </span>
                      </div>
                    );
                  } else {
                    // Regular line
                    return (
                      <p key={i} className="text-black font-normal">
                        {line}
                      </p>
                    );
                  }
                })}
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={index} className="text-black font-normal">
              {section}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">AI Coach</h1>
            <p className="text-sm text-gray-500">
              Ask me for advice on health, fitness, and wellness
            </p>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-3 max-w-md mx-auto p-6 rounded-lg bg-white shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Welcome to AI Coach</h3>
                <p className="text-gray-500 text-sm">
                  Ask me anything about health, fitness, nutrition, or wellness.
                  I am here to help you achieve your goals.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
                ref={index === messages.length - 1 ? messagesEndRef : null}>
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-green-600 text-white">
                      AC
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.role === "user"
                      ? "bg-green-500 text-white"
                      : "bg-white shadow-sm"
                  )}>
                  {message.role === "user" ? (
                    <p>{message.content}</p>
                  ) : (
                    formatMessage(message.content)
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-purple-600 text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-green-600 text-white">
                  AC
                </AvatarFallback>
              </Avatar>
              <div className="bg-white shadow-sm rounded-lg p-4 max-w-[80%]">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "0ms" }}></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "150ms" }}></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your coach..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-black hover:bg-gray-800">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
