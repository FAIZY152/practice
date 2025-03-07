"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import dynamic from "next/dynamic";
import useUserStore from "@/store/UserStore";
import { EmptyState } from "./Empty";

// Lazy load large dependencies to reduce initial load time
const BotAvatar = dynamic(() => import("../other/BotAvatar"), { ssr: false });
const Loader = dynamic(() => import("./Loader"), { ssr: false });
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

interface ChatMessage {
  role: "user" | "assistant" | "model";
  content: string;
}

const formSchema = z.object({
  chat: z.string().min(1, "Message cannot be empty"),
});

type FormData = z.infer<typeof formSchema>;

export default function CodeGeneration() {
  const { user, setUsageCount, usageCount } = useUserStore.getState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chat: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);

    const userMessage: ChatMessage = {
      role: "user", // User input is correctly labeled as "user"
      content: values.chat,
    };

    // Update UI with the new user message
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Ensure the request includes properly formatted messages
      const response = await axios.post("/api/code", {
        userId: user?.id,
        messages: [...messages, userMessage].map((msg) => ({
          role: msg.role === "assistant" ? "model" : msg.role, // Convert "assistant" to "model"
          content: msg.content,
          cache: "no-cache",
        })),
      });

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      if (
        response.data.error === "Free limit reached, please upgrade" ||
        usageCount >= 5
      ) {
        window.location.href = "/pricing"; // 🚀 Redirect to upgrade page
      } else {
        const botMessage: ChatMessage = {
          role: "model", // Gemini API expects "model" instead of "assistant"
          content: response.data.content,
        };
        setUsageCount(usageCount + 1);

        // Update UI with the bot's response
        setMessages((prev) => [...prev, botMessage]);
      }

      // Reset input field after successful response
      form.reset();
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 transition-all duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-teal-100 flex items-center justify-center">
          <Code className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Code Generator</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Ask Me Anything About Code Generation
          </p>
        </div>
      </div>

      {/* Input Form */}
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
                    placeholder="Ask about Code Generation."
                    className="bg-white shadow-sm border-0 focus-visible:ring-teal-500 h-10 sm:h-12"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 shadow-sm h-10 sm:h-12 px-3 sm:px-4 whitespace-nowrap">
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </form>
      </Form>

      {/* Messages */}
      <div className="space-y-4 min-h-[300px] max-h-[calc(100vh-250px)] overflow-y-auto rounded-lg p-2 sm:p-4 bg-gray-50 custom-scrollbar">
        {messages.length === 0 && !isLoading && (
          <EmptyState
            actionLabel="Generate Code"
            title="Code Generation"
            description="Ask me anything about code generation"
          />
        )}
        {isLoading && <Loader />}

        <div className="flex flex-col gap-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-x-2 sm:gap-x-4 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}>
              {message.role === "user" ? (
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8 bg-teal-600 shrink-0">
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="shrink-0">
                  <BotAvatar />
                </div>
              )}
              <div
                className={`flex-1 p-3 sm:p-6 rounded-lg ${
                  message.role === "user"
                    ? "bg-teal-600 text-white"
                    : "bg-white shadow-sm"
                }`}>
                {message.role === "user" ? (
                  <p className="text-sm sm:text-base">{message.content}</p>
                ) : (
                  <ReactMarkdown
                    components={{
                      h1: (props) => (
                        <h1
                          className="text-xl sm:text-2xl font-bold text-teal-800 mb-2"
                          {...props}
                        />
                      ),
                      h2: (props) => (
                        <h2
                          className="text-lg sm:text-xl font-semibold text-teal-700 mb-2"
                          {...props}
                        />
                      ),
                      h3: (props) => (
                        <h3
                          className="text-base sm:text-lg font-medium text-teal-600 mb-2"
                          {...props}
                        />
                      ),
                      p: (props) => (
                        <p
                          className="text-sm sm:text-base text-gray-700 mb-2"
                          {...props}
                        />
                      ),
                      ul: (props) => (
                        <ul
                          className="list-disc pl-4 sm:pl-5 mb-2 text-sm sm:text-base"
                          {...props}
                        />
                      ),
                      ol: (props) => (
                        <ol
                          className="list-decimal pl-4 sm:pl-5 mb-2 text-sm sm:text-base"
                          {...props}
                        />
                      ),
                      li: (props) => (
                        <li
                          className="text-sm sm:text-base text-gray-700 mb-1"
                          {...props}
                        />
                      ),
                      code: ({
                        inline,
                        className,
                        ...props
                      }: {
                        inline?: boolean;
                        className?: string;
                      } & React.HTMLProps<HTMLElement>) =>
                        inline ? (
                          <code
                            className="bg-gray-100 text-teal-700 px-1 py-0.5 rounded text-sm"
                            {...props}
                          />
                        ) : (
                          <div className="relative">
                            <span className={className}></span>
                            <code
                              className="block bg-gray-100 text-teal-800 p-2 rounded mb-2 text-xs sm:text-sm overflow-x-auto"
                              {...props}
                            />
                          </div>
                        ),
                    }}>
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
