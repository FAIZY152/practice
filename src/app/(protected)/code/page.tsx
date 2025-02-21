"use client";
import dynamic from "next/dynamic";
import React from "react";

// Lazy load CodeGeneration to prevent server compilation delays
const CodeGeneration = dynamic(
  () => import("@/components/Main/pages/CodeGeneration"),
  { ssr: false }
);

const Coding = () => {
  return <CodeGeneration />;
};

export default Coding;
