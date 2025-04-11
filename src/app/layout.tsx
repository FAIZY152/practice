import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 🚀 Preload dashboard and other pages */}
        <Script id="preload-dashboard-pages" strategy="beforeInteractive">
          {`
            window.addEventListener('load', () => {
              fetch('/dashboard');
              fetch('/login');
              fetch('/regester');
              fetch('/conversation');
              fetch('/images');
              fetch('/codeReviwer');
              fetch('/code');
              fetch('/remover');
              fetch('/ai-coach');
              fetch('/funbot');
            });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
