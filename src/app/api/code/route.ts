import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkApiLimit } from "@/lib/api-limit";

const SYSTEM_PROMPT = `
You are an AI Code Generator.
Generate only code based on the given prompt, without explanations or additional text.
Ensure the code is complete, syntactically correct, and follows best practices.
`;

<<<<<<< HEAD

=======
// ✅ Load Google Gemini API Key
>>>>>>> e67d118 (changes)
const apiKey = process.env.GOOGLE_GEMENI_API;
if (!apiKey) {
  console.error("❌ GOOGLE_GEMINI_API key is missing from .env.local");
  throw new Error("Google API key is missing.");
}

<<<<<<< HEAD

=======
// ✅ Initialize Gemini AI
>>>>>>> e67d118 (changes)
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
<<<<<<< HEAD
    

    const { userId, messages } = body;

=======
    console.log("📥 Received Payload:", JSON.stringify(body, null, 2));

    const { userId, messages } = body;

    // ✅ Validate input
>>>>>>> e67d118 (changes)
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

<<<<<<< HEAD
   
=======
    // ✅ Format messages for Gemini API
>>>>>>> e67d118 (changes)
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

<<<<<<< HEAD
 
=======
    // ✅ Send request to Gemini API
>>>>>>> e67d118 (changes)
    const result = await model.generateContent({
      contents: formattedMessages,
    });

    const response = await result.response;
    const botResponse = response.text() || "I don't understand.";

<<<<<<< HEAD
  

    
=======
    console.log("✅ AI Response:", botResponse);

    // ✅ API Limit Check
>>>>>>> e67d118 (changes)
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
