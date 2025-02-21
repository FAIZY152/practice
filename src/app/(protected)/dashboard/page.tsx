"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

// Lazy load dashboard (ensures no SSR delay)
const DashboardPage = dynamic(
  () => import("@/components/Main/pages/dashboard"),
  { ssr: false }
);

const MainDashboard = () => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  return (
    <>
      {/* 🚀 Secretly Render Dashboard in Background */}
      {isRendered && (
        <div style={{ position: "absolute", left: "-9999px" }}>
          <DashboardPage />
        </div>
      )}

      {/* Actual Render */}
      <DashboardPage />
    </>
  );
};

export default MainDashboard;
