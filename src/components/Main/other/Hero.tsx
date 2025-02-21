"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
  const texts = [
    "AI Assistant",
    "AI Chatbot",
    "Code Generation",
    "Code Reviewer",
    "Image Generation",
    "BG Remover",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
        The Best AI Tool for
        <motion.span
          key={texts[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
          {texts[index]}
        </motion.span>
      </h1>
      <p className="text-gray-400 text-lg md:text-xl mb-8">
        Create content using AI 10x faster.
      </p>
      <Link href="/login">
        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white px-8 py-6 text-lg rounded-full"
          size="lg">
          Start Generating For Free
        </Button>
      </Link>
      <p className="text-gray-500 mt-4 text-sm">No credit card required.</p>
    </section>
  );
}
