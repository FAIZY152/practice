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
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-zinc-400">
          {usageCount} / {maxLimit} Free Generations
        </p>
        <div className="relative w-full h-2 bg-gray-300 rounded-full">
          {/* Progress Fill */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progressValue}%` }}></div>
        </div>
      </div>
      <Button
        onClick={() => setopen(true)}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
        variant="default">
        <Zap className="w-4 h-4 mr-2" />
        Upgrade
      </Button>
      {open && <UpgradeDialog open={open} setopen={setopen} />}
    </div>
  );
}
