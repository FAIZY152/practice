import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { checkApiLimit } from "@/lib/api-limit";

dotenv.config();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as Blob | null;
    const userId = formData.get("userId") as string | null;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
      );
    }

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.BACKGROUND_REMOVER_API; // Load API key from environment variables

    const buffer = await image.arrayBuffer(); // Convert image to buffer
    const base64Image = Buffer.from(buffer).toString("base64");

    // Send request to remove.bg API
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_file_b64: base64Image, size: "auto" }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      const limitResponse = await checkApiLimit(userId);
      if (limitResponse) return limitResponse;

      return NextResponse.json(
        { error: errorData.errors[0].title },
        { status: response.status }
      );
    }

    // Convert the response to a Buffer
    const resultBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString("base64");
    const resultUrl = `data:image/png;base64,${resultBase64}`; // Create base64 image URL

    return NextResponse.json({ imageUrl: resultUrl }); // Return the processed image URL
  } catch (error) {
    console.error("Background removal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
