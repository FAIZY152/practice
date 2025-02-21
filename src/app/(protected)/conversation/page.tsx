"use client";
import dynamic from "next/dynamic";

// Lazy load ChatInterface (removes SSR delays)
const ChatInterface = dynamic(
  () => import("@/components/Main/pages/Converstation"),
  { ssr: false }
);

const ConverstaionPage = () => {
  return <ChatInterface />;
};

export default ConverstaionPage;
