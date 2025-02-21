"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="container mx-auto px-4 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        <span className="text-white font-semibold text-xl">Genius</span>
      </Link>

      <Link href={"/login"} prefetch>
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-100 text-black">
          Get Started
        </Button>
      </Link>
    </header>
  );
}
