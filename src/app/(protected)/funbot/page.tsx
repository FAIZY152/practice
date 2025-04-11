"use client";
import dynamic from "next/dynamic";
import React from "react";

// Lazy load FunBot to prevent server compilation delays
const FunBotComponent = dynamic(
  () => import("@/components/Main/pages/FunBot"),
  {
    ssr: false,
  }
);

const FunBotPage = () => {
  return <FunBotComponent />;
};

export default FunBotPage;
