import { checkApiLimit } from "@/lib/api-limit";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text(); // Read raw text to check if it's empty
    if (!body) {
      return NextResponse.json(
        { error: "Request body is empty" },
        { status: 400 }
      );
    }

    const { prompt, userId } = JSON.parse(body); // ✅ Extract userId
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing 'prompt' in request body" },
        { status: 400 }
      );
    }
    function generateRandomNumber(): number {
      return Math.floor(Math.random() * 100000) + 1;
    }
    const randomNumber = generateRandomNumber();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}&seed=${randomNumber}&noLogo=true&width=512&height=512`;

    const limitResponse = await checkApiLimit(userId);
    if (limitResponse) return limitResponse;

    await fetch(imageUrl);
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid JSON input" }, { status: 400 });
  }
}
