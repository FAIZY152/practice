import React from "react";

const LoadingComp = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative inline-flex ">
        <div className="w-8 h-8 bg-[#8E2FE4] rounded-full" />
        <div className="w-8 h-8 bg-[#8E2FE4] rounded-full absolute top-0 left-0 animate-ping" />
        <div className="w-8 h-8 bg-[#8E2FE4] rounded-full absolute top-0 left-0 animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingComp;
