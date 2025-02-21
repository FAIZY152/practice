"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import useUserStore from "@/store/UserStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const UserAccount = () => {
  const { user, setUser, logout } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.user) setUser(data.user);
      console.log(data);
    };

    fetchUserProfile();
  }, [setUser]);

  return (
    <div className="relative right-5">
      {user ? (
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="cursor-pointer border-2 border-gray-300 shadow-md transition-transform hover:scale-105">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold">
                CN
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-48 rounded-xl border border-gray-200 shadow-lg bg-white p-4">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="w-12 h-12 border-2 border-gray-300">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold">
                  CN
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-semibold text-gray-700">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>

              <Separator className="w-full mt-3" />

              <Button
                onClick={logout}
                variant="outline"
                className="w-full mt-3 flex items-center gap-2 text-red-600 hover:bg-red-100 transition">
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button
          onClick={() => router.push("/login")}
          className="bg-[#9333EA] text-white">
          Login
        </Button>
      )}
    </div>
  );
};

export default UserAccount;
