"use client";
import dynamic from "next/dynamic";
import React from "react";

// Lazy load AiCoach to prevent server compilation delays
const AiCoachUi = dynamic(() => import("@/components/Main/pages/AiCoachUi"), {
  ssr: false,
});

const AiCoach = () => {
  return <AiCoachUi />;
};

export default AiCoach;
