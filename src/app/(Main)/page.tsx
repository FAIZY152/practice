"use client";
import Hero from "@/components/Main/other/Hero";
import Navbar from "@/components/Main/other/Navbar";
import Testimonials from "@/components/Main/other/Testimonials";
import { MessageCircle } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0f1117] relative">
      <Navbar />
      <Hero />
      <Testimonials />

      {/* Chat Icon */}
      <button className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg hover:opacity-90 transition-opacity">
        <MessageCircle className="text-white size-6" />
      </button>
    </div>
  );
}
