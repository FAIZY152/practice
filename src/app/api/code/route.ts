import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkApiLimit } from "@/lib/api-limit";

const SYSTEM_PROMPT = `
You are an expert AI Code Generator.
Your task is to generate only high-quality, complete, and fully functional code based on the given prompt.
Do not provide any explanations, or additional text.
Ensure the code is:
- Complete and syntactically correct
- Follows language-specific best practices and style guides
- Readable, efficient, and maintainable
- Robust and error-free
Focus entirely on generating the best possible code output.
`;


const apiKey = process.env.GOOGLE_GEMENI_API;
if (!apiKey) {
  console.error("❌ GOOGLE_GEMINI_API key is missing from .env.local");
  throw new Error("Google API key is missing.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, messages } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const formattedMessages = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] }, // System instruction
      ...messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ];

    console.log(
      "🔹 Sending Request to Gemini API:",
      JSON.stringify({ contents: formattedMessages }, null, 2)
    );

    const result = await model.generateContent({
      contents: formattedMessages,
    });

    const response = await result.response;
    const botResponse = response.text() || "I don't understand.";

    const limitResponse = await checkApiLimit(userId);
    if (limitResponse) return limitResponse;

    return NextResponse.json({ content: botResponse });
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);
    return NextResponse.json(
      { error: "Google Gemini API Error. Check your API key and permissions." },
      { status: 500 }
    );
  }
}
