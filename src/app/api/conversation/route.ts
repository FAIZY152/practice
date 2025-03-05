import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini 2.0 Flash model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Optionally prepend a system-level instruction (using "user" role)
    // since Gemini does not support a "system" role.
    const prompt = `You are an AI chatbot. Assist the user with their questions.\n` +
      messages.map((msg) => msg.content).join("\n");

    // Generate a response using the Gemini 2.0 Flash model
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ content: responseText });
  } catch (error) {
    console.error("Gemini API Chatbot Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
