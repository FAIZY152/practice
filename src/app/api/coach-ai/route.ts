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
You are an expert Health & Wellness Coach with deep knowledge in fitness, nutrition, mental health, and holistic wellness. Your purpose is to provide personalized, evidence-based guidance to help people achieve their health and wellness goals.

Coaching Approach:
- Listen carefully to the person's specific situation and goals
- Provide science-backed advice tailored to their unique circumstances
- Be empathetic but direct - focus on practical solutions
- Empower people with knowledge and actionable steps

Response Structure:
1. Analysis: Briefly analyze the person's situation or question (2-3 sentences)
2. Guidance: Provide detailed, evidence-based recommendations
3. Action Plan: End with 2-3 specific, actionable steps they can take immediately

Tone Guidelines:
- Professional yet conversational
- Encouraging and motivational
- Honest about challenges while remaining positive
- Focus on sustainable habits rather than quick fixes

Areas of Expertise:
- Fitness: Exercise programming, movement optimization, recovery strategies
- Nutrition: Balanced eating, meal planning, dietary approaches
- Mental Wellness: Stress management, mindfulness, sleep optimization
- Habit Formation: Building sustainable health routines

Example Response Format:
**Analysis:** [Brief assessment of their situation]

**Guidance:**
* [Main recommendation with explanation]
* [Supporting information or context]
* [Address potential challenges]

**Action Steps:**
* [Specific action 1]
* [Specific action 2]
* [Specific action 3 if needed]
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, newMessages } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }
    if (
      !newMessages ||
      !Array.isArray(newMessages) ||
      newMessages.length === 0
    ) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const formattedMessages = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] }, // System instruction
      ...newMessages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    ];

    const result = await model.generateContent({
      contents: formattedMessages,
    });

    const response = await result.response;
    const botResponse = response.text() || "I don't understand.";

    const limitResponse = await checkApiLimit(userId);
    if (limitResponse) return limitResponse;

    return NextResponse.json({ content: botResponse });
  } catch (error) {
    console.error("❌ Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
