"use client";

import { useState } from "react";

import { loginUser } from "@/actions/auth/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "./icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import useUserStore from "@/store/UserStore";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "check@gmail.com",
    password: "12345",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await loginUser(form.email, form.password);
      if (res.success) {
        useUserStore.getState().setUser(res.user);
        setMessage(res.success);
        // Force a hard refresh to trigger the middleware
        router.replace("/dashboard");
      } else if (res.error) {
        setMessage(res.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("An unknown error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl">
        <Button className="bg-[#4F46E5]" onClick={() => router.push("/")}>
          <ArrowLeft />{" "}
        </Button>
        <div className="text-center">
          <Icons.GeniusAI className="w-20 h-20 mx-auto text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your Genius AI account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="sr-only">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                className="w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <Input
                id="password"
                type="password"
                placeholder="Password"
                required
                value={form.password}
                className="w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="remember-me"
                className="block ml-2 text-sm text-gray-900">
                Remember me
              </label>
            </div>
          </div>

          {isLoading ? (
            <Button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign in
            </Button>
          )}
        </form>

        {message && (
          <p className="mt-3 text-sm text-center text-green-600 transition-opacity duration-300 ease-in-out">
            {message}
          </p>
        )}

        <p className="mt-2 text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/regester"
            className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
