import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Fix path (removed `/app/` prefix)
import { Sidebar } from "@/components/Main/pages/Sidebar";
import UserAccount from "@/components/Main/auth/UserAccount";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen`}>
      <div className="flex justify-between w-full">
        <div className="w-[20%]">
          <Sidebar />
        </div>
        <div className="w-[80%]">{children}</div>
        <div className="w-[5%] mt-3">
          <UserAccount />
        </div>
      </div>
    </div>
  );
}
