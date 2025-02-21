import { checkApiLimit } from "@/lib/api-limit";
import { NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = {
  role: "user", // Gemini does not support "system", so use "user" instead.
  parts: [
    {
      text: "You are a Code Generator. A helpful assistant that can help with code generation and debugging. Always provide code snippets when applicable.",
    },
  ],
};

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

    // Map roles correctly: Gemini supports only "user" and "model"
    const formattedMessages = [
      SYSTEM_INSTRUCTION, // Set chatbot instruction
      ...messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user", // Convert "assistant" to "model"
        parts: [{ text: msg.content }],
      })),
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_GEMENI_API}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formattedMessages }),
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const botResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "I don't understand.";
      
    const limitResponse = await checkApiLimit(userId);
    if (limitResponse) return limitResponse;

    return NextResponse.json({ content: botResponse });
  } catch (error) {
    console.error("Gemini API Chatbot Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
