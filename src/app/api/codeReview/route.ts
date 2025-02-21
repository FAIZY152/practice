import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkApiLimit } from "@/lib/api-limit";

const SYSTEM_PROMPT = `
You are an AI-powered code generator.
Generate high-quality, optimized, and well-structured code based on user input.
Ensure proper syntax, best practices, and modularity in the generated code.
`;

// Initialize Google Gemini API
const apiKey = process.env.CODE_REVIWER_API;
if (!apiKey) {
  console.error("❌ GOOGLE_GEMINI_API key is missing from .env.local");
  throw new Error("Google API key is missing.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, prompt } = body;
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    // Create AI prompt
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Prompt:\n${prompt}`;

    // Send request to Google Gemini API
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    const response = await result.response;
    const generatedCode = response.text();

    const limitResponse = await checkApiLimit(userId);
    if (limitResponse) return limitResponse;
    return NextResponse.json({ generatedCode });
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);
    return NextResponse.json(
      { error: "Google Gemini API Error. Check your API key and permissions." },
      { status: 500 }
    );
  }
}
