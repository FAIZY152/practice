import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const FREE_LIMIT = 5; // Max free requests per user

export async function checkApiLimit(userId: string) {
  try {
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
      );
    }

    // Fetch or create the user usage record
    let userUsage = await prisma.userUsage.findUnique({
      where: { userId },
    });

    if (!userUsage) {
      userUsage = await prisma.userUsage.create({
        data: { userId, usageCount: 1 }, // First request
      });
    } else if (userUsage.usageCount >= FREE_LIMIT) {
      return NextResponse.json(
        { error: "Free limit reached, please upgrade" },
        { status: 403 }
      );
    } else {
      await prisma.userUsage.update({
        where: { userId },
        data: { usageCount: userUsage.usageCount + 1 },
      });
    }
    console.log(
      `✅ User ${userId} used API ${userUsage.usageCount + 1} times.`
    );

    return null; // Continue processing the API request
  } catch (error) {
    console.error("API Limit Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
