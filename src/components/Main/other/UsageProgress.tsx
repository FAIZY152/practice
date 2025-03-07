"use client";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import useUserStore from "@/store/UserStore";
import { useState } from "react";
import { UpgradeDialog } from "./UpgradePop";

export default function UsageProgress() {
  const { usageCount } = useUserStore(); // Get usage count from Zustand
  const maxLimit = 5; // Maximum free generations
  const progressValue = (usageCount / maxLimit) * 100;
  const [open, setopen] = useState(false);

  return (
    <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-xs sm:text-sm font-medium text-zinc-500">
            Free Generations
          </p>
          <p className="text-xs sm:text-sm font-semibold text-zinc-700">
            {usageCount} / {maxLimit}
          </p>
        </div>
        <div className="relative w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Progress Fill */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressValue}%` }}>
            {progressValue > 75 && (
              <div className="absolute top-0 right-0 h-full w-2 bg-white/20 animate-pulse"></div>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={() => setopen(true)}
        className="w-full h-9 sm:h-10 text-xs sm:text-sm bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
        variant="default">
        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
        Upgrade Now
      </Button>

      {open && <UpgradeDialog open={open} setopen={setopen} />}
    </div>
  );
}
