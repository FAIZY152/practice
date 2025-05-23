import { NextResponse, NextRequest } from "next/server";
import { checkApiLimit } from "@/lib/api-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    if (!body)
      return NextResponse.json({ error: "Empty request" }, { status: 400 });

    const { prompt, userId } = JSON.parse(body);
    if (!prompt || !userId)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const randomNumber = Math.floor(Math.random() * 100000) + 1;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}&seed=${randomNumber}&noLogo=true&width=512&height=512`;

    const limitResponse = await checkApiLimit(userId);
    if (limitResponse) return limitResponse;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
