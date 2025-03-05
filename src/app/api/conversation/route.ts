import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GOOGLE_GEMENI_API; // Ensure this is correctly set in .env file // ✅ Use the working model

export async function POST(req: Request) {
  try {
    const body = await req.json();


    const { messages, userId } = body;

    
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

   
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts:
        msg.parts && msg.parts.length > 0 ? msg.parts : [{ text: msg.content }], // ✅ Fix here
    }));

    console.log(
      "🔹 Sending Request to Gemini API:",
      JSON.stringify({ contents: formattedMessages }, null, 2)
    );

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formattedMessages }),
      }
    );

  
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Invalid JSON Response from Gemini API:", text);
      return NextResponse.json(
        { error: "Invalid response from AI API" },
        { status: 500 }
      );
    }

    if (!data || data.error) {
      console.error("❌ Gemini API Error:", data?.error);
      return NextResponse.json(
        { error: data?.error?.message || "AI API error" },
        { status: 500 }
      );
    }

   
    const botResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "I don't understand.";

  

    return NextResponse.json({ content: botResponse });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
