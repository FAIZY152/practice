"use client";

import { useState, useRef, useEffect } from "react";
import useUserStore from "@/store/UserStore";
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Random fun emojis for messages
const funEmojis = [
  "😂",
  "🤣",
  "😎",
  "🔥",
  "💯",
  "👌",
  "✌️",
  "🤪",
  "😜",
  "🥳",
  "🤩",
  "👻",
  "💁‍♀️",
  "🙌",
  "👍",
];

// Random Hinglish expressions
const hinglishExpressions = [
  "Ekdum mast!",
  "Kya baat hai!",
  "Bilkul correct!",
  "Maja aa gaya!",
  "Ekdum lit!",
  "Full vibe hai!",
  "Bindaas!",
  "Zabardast!",
  "Dil se!",
  "Mast hai yaar!",
];

export default function FunBot() {
  const { userid, setUsageCount, usageCount } = useUserStore.getState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [randomEmoji, setRandomEmoji] = useState(
    () => funEmojis[Math.floor(Math.random() * funEmojis.length)]
  );

  // Change emoji every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomEmoji(funEmojis[Math.floor(Math.random() * funEmojis.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const res = await fetch("/api/ai-funbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userid,
          messages: newMessages,
        }),
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

        // Use a random Hinglish expression for success message
        const randomExpression =
          hinglishExpressions[
            Math.floor(Math.random() * hinglishExpressions.length)
          ];
        toast.success(randomExpression);
      } else {
        toast.error("Oops! FunBot is taking a chai break ☕");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error:", errorMessage);
      toast.error("Server ne dhoka de diya! Try again later 😅");
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    // Split content into sections based on double newlines
    const sections = content.split("\n\n").filter(Boolean);

    return (
      <div className="space-y-4">
        {sections.map((section, index) => {
          // Check for any heading pattern: **Heading:**
          const headingMatch = section.match(/^\*\*(.*?):\*\*/);

          if (headingMatch) {
            // Extract the section name from the heading match
            const sectionName = headingMatch[1].trim();
            const contentText = section.replace(headingMatch[0], "").trim();

            // Special handling for Reaction section
            if (sectionName.toLowerCase() === "reaction") {
              return (
                <div key={index} className="space-y-2">
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300">
                    {sectionName}
                  </Badge>
                  <p className="text-black font-normal text-lg">
                    {contentText}
                  </p>
                </div>
              );
            }

            // Special handling for Meme Moment section
            if (sectionName.toLowerCase() === "meme moment") {
              return (
                <div key={index} className="space-y-2">
                  <Badge
                    variant="outline"
                    className="bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-300">
                    {sectionName}
                  </Badge>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg border border-purple-200">
                    <p className="text-black font-medium italic">
                      {contentText}
                    </p>
                  </div>
                </div>
              );
            }

            // Special handling for Fun Take section
            if (sectionName.toLowerCase() === "fun take") {
              return (
                <div key={index} className="space-y-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300">
                    {sectionName}
                  </Badge>
                  <p className="text-black font-normal">{contentText}</p>
                </div>
              );
            }

            // Special handling for Vibe Check section
            if (sectionName.toLowerCase() === "vibe check") {
              return (
                <div key={index} className="space-y-2">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
                    {sectionName}
                  </Badge>
                  <p className="text-black font-medium text-lg">
                    {contentText}
                  </p>
                </div>
              );
            }

            // Generic heading handling for other section types
            return (
              <div key={index} className="space-y-2">
                <Badge
                  variant="outline"
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300">
                  {sectionName}
                </Badge>
                <p className="text-black font-normal">{contentText}</p>
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

  // Fun suggestions for the user to try
  const suggestions = [
    "Tell me a joke in Hinglish",
    "What's the latest gossip?",
    "Kya chal raha hai aajkal?",
    "Tell me a funny story",
    "Pakistan ke baare mein kuch batao",
    "Weekend plans kya hai?",
    "Mujhe hasao please!",
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white p-4 shadow-sm flex items-center justify-between border-b border-purple-100">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}>
              <Smile className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  FunBot
                </h1>
                <span className="text-2xl">{randomEmoji}</span>
              </div>
              <p className="text-sm text-gray-500">
                Meme-loving, Hinglish-speaking fun companion
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 border-purple-200">
            Hinglish Mode
          </Badge>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-center space-y-4 max-w-md mx-auto p-6 rounded-lg bg-white shadow-sm border border-purple-100">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto"
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}>
                  <Smile className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Oyee , main hoon FunBot! 🙏
                </h3>
                <p className="text-gray-600 text-sm">
                  Eng + Hind mein baat karenge, memes share karenge, aur full
                  masti karenge! Let&#39;s have some fun conversation!
                </p>

                {/* Suggestions */}
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Try asking me:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-purple-50 hover:bg-purple-100 cursor-pointer transition-colors duration-200 text-purple-800 border-purple-200"
                        onClick={() => setInput(suggestion)}>
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
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
                  <Avatar className="w-10 h-10 mt-1">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      FB
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white shadow-sm border border-purple-100"
                  )}>
                  {message.role === "user" ? (
                    <p>{message.content}</p>
                  ) : (
                    formatMessage(message.content)
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="w-10 h-10 mt-1">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  FB
                </AvatarFallback>
              </Avatar>
              <div className="bg-white shadow-sm rounded-lg p-4 max-w-[80%] border border-purple-100">
                <div className="flex space-x-2">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-purple-400"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: 0,
                    }}
                  />
                  <motion.div
                    className="w-3 h-3 rounded-full bg-pink-400"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: 0.1,
                    }}
                  />
                  <motion.div
                    className="w-3 h-3 rounded-full bg-purple-400"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: 0.2,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-purple-100">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type something fun..."
              className="flex-1 border-purple-200 focus-visible:ring-purple-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
