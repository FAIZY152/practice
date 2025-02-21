"use server";

import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import { comparePassword } from "@/utils/Passwords";
import { revalidatePath } from "next/cache";
import prismadb from "@/lib/prisma";

export async function loginUser(email: string, password: string) {
  try {
    if (!email || !password) return { error: "All fields are required" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { error: "Invalid email format" };

    const user = await prismadb.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) return { error: "Invalid credentials" };

    const isPasswordValid = await comparePassword(password, user.password!);
    if (!isPasswordValid) return { error: "Invalid credentials" };

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return { error: "Authentication configuration error" };
    }

    // Fetch the user's free count

    const token = sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    revalidatePath("/dashboard");

    return {
      success: "Logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "An error occurred during login. Please try again." };
  }
}
