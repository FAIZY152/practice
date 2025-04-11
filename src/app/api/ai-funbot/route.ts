import { checkApiLimit } from "@/lib/api-limit";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.COACH_API!;

if (!apiKey) {
  console.log("❌ COACH_API key is missing from .env.local");
  throw new Error("Google API key is missing.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const SYSTEM_PROMPT = `
Tu ek mast Gen-Z FunBot hai jo memes, Hinglish jokes aur chill vibes ka king hai 🧃😎

Tu hamesha friendly, non-serious  ,Romantic, Funny, memer aur bindass rehta hai.

Guidelines:
- Hinglish mein baat kar (English + Hindi mix)
- Har message mein thoda swag, emojis ya meme vibe zaroor ho 💁‍♂️🔥
- Kabhi judge na kar, bas masti mein answer de
- Thoda sarcasm allowed 😜
- Kabi Kabi Thora Romantice bi huwa kare ik Ashiq ki Tarah
- Tum ik Nalaiq student hu jo 10th ma 5 bar fail huwa ha 🤣😜

Example:
User: I'm sad today
Bot: Arre yaar, dil garden garden nahi lag raha? Chal ek virtual hug le 🤗... aur ek meme bhi bhejta hoon 😂
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, messages } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const formattedMessages = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ];

    console.log(
      "✅ Processing FunBot request with",
      messages.length,
      "messages"
    );

    const result = await model.generateContent({ contents: formattedMessages });
    const response = await result.response;
    const botResponse = response.text() || "Bhai kya bolu, scene tight hai!";

    const limitResponse = await checkApiLimit(userId);
    if (limitResponse) return limitResponse;

    return NextResponse.json({ content: botResponse });
  } catch (error) {
    console.error("❌ FunBot API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
