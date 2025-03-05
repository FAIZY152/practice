"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import useUserStore from "@/store/UserStore";
import { EmptyState } from "./Empty";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const BotAvatar = dynamic(() => import("../other/BotAvatar"), { ssr: false });
const Loader = dynamic(() => import("./Loader"), { ssr: false });

const MessageCircle = dynamic(
  () => import("lucide-react").then((mod) => mod.MessageCircle),
  { ssr: false }
);

interface ChatMessage {
  role: "user" | "assistant" | "model";
  content: string;
}

const formSchema = z.object({
  chat: z.string().min(1, "Message cannot be empty"),
});

type FormData = z.infer<typeof formSchema>;

export default function ChatInterface() {
  const { user, setUsageCount, usageCount } = useUserStore.getState();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { chat: "" },
  });

  const formatMessage = useCallback((content: string) => {
    const sections = content.split("\n\n").filter(Boolean);

    return (
      <div className="space-y-6">
        {sections.map((section, index) => {
          if (section.startsWith("**")) {
            return (
              <h2
                key={index}
                className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-800 bg-clip-text text-transparent">
                {section.replace(/\*\*/g, "")}
              </h2>
            );
          }

          if (section.includes("* ")) {
            const [subheading, ...points] = section.split("\n");
            return (
              <div key={index} className="space-y-4">
                {subheading && (
                  <h3 className="text-sm font-normal text-purple-700">
                    {subheading.replace(/\*\*/g, "")}
                  </h3>
                )}
                <ul className="space-y-2">
                  {points
                    .filter((point) => point.trim().startsWith("*"))
                    .map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-2 w-2 mt-2 rounded-full bg-purple-400" />
                        <span className="text-gray-700">
                          {point.replace("*", "").trim()}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            );
          }

          return (
            <p key={index} className="text-sm text-gray-500 leading-relaxed">
              {section.replace(/\*\*.*?\*\*/g, "")}
            </p>
          );
        })}
      </div>
    );
  }, []);

  const onSubmit = async (values: FormData) => {
    if (!user?.id) {
      toast.error("Please log in to continue.");
      return;
    }

    setIsLoading(true);

    // ✅ Include the new user message before sending the request
    const userMessage: ChatMessage = { role: "user", content: values.chat };
    const updatedMessages = [...messages, userMessage];

    console.log(
      "🔹 Sending Request to API:",
      JSON.stringify(
        {
          userId: user.id,
          messages: updatedMessages.map(({ role, content }) => ({
            role: role === "assistant" ? "model" : role, // ✅ Convert "assistant" to "model"
            parts: [{ text: content }], // ✅ Match Google Gemini API format
          })),
        },
        null,
        2
      )
    );

    try {
      const response = await axios.post("/api/conversation", {
        userId: user.id,
        messages: updatedMessages.map(({ role, content }) => ({
          role: role === "assistant" ? "model" : role,
          parts: [{ text: content }],
        })),
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      if (
        response.data.error === "Free limit reached, please upgrade" ||
        usageCount >= 5
      ) {
        window.location.href = "/pricing"; // Redirect to pricing page
      } else {
        // ✅ Get AI Response from Gemini API
        const botMessage: ChatMessage = {
          role: "model",
          content: response.data.content, // ✅ Extract AI response
        };

        setUsageCount(usageCount + 1);
        setMessages([...updatedMessages, botMessage]); // ✅ Append AI response
        form.reset();
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">AI Assistant</h1>
          <p className="text-sm text-gray-500">
            Ask me anything about any topic
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="chat"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Ask me anything..."
                    className="bg-white shadow-sm border-0 focus-visible:ring-purple-500"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 shadow-sm">
            {isLoading ? "Thinking..." : "Ask"}
          </Button>
        </form>
      </Form>

      <div className="space-y-4 min-h-[300px] max-h-[600px] overflow-y-auto rounded-lg p-4 bg-gray-50 custom-scrollbar">
        {messages.length === 0 && !isLoading && <EmptyState />}
        {isLoading && <Loader />}

        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? messagesEndRef : null}
              className={`flex gap-x-4 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}>
              {message.role === "user" ? (
                <Avatar className="w-8 h-8 bg-purple-600">
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <BotAvatar />
              )}
              <div
                className={`flex-1 p-6 rounded-lg ${
                  message.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-white shadow-sm"
                }`}>
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  formatMessage(message.content)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
