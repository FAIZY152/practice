"use client";

import { useState, useEffect } from "react";
import { Icons } from "@/components/Main/auth/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

// Mock data type
interface UserData {
  name: string;
  email: string;
  avatar?: string;
  tokenCount: number;
  maxTokens: number;
}

// Mock data
const mockUserData: UserData = {
  name: "John Doe",
  email: "john@example.com",
  tokenCount: 150,
  maxTokens: 1000,
};

export default function SettingPage() {
  const [userData, setUserData] = useState<UserData>(mockUserData);

  useEffect(() => {
    // Fetch user data here
    // For now, we're using mock data
    setUserData(mockUserData);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Icons.GeniusAI className="h-8 w-8 text-indigo-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            className="text-indigo-600 hover:text-indigo-800">
            Logout
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Image
                    src={userData.avatar || "/placeholder.svg"}
                    alt={userData.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{userData.name}</h2>
                    <p className="text-gray-500">{userData.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Token Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress
                    value={(userData.tokenCount / userData.maxTokens) * 100}
                  />
                  <p className="text-sm text-gray-500">
                    {userData.tokenCount} / {userData.maxTokens} tokens used
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
