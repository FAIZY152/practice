"use server";

import prismadb from "@/lib/prisma";
import { hashPassword } from "@/utils/Passwords";
import { revalidatePath } from "next/cache";

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  try {
    // Input validation
    if (!name || !email || !password) {
      return { error: "All fields are required" };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return { error: "Invalid email format" };
    }

    // Check if user already exists
    const existingUser = await prismadb.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Email already in use" };
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);

    const user = await prismadb.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      },
    });

    // If successful, revalidate and redirect
    revalidatePath("/dashboard");

    // Return success before redirect
    return {
      success: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "An error occurred during registration. Please try again.",
    };
  }
}
