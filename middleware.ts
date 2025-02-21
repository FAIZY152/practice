import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

// Debug: Check if environment variable is loaded
if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is missing in environment variables!");
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;



  // Redirect authenticated users away from auth pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET!);
      console.log("✅ Token Decoded Successfully:", decoded);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      console.error("❌ Invalid Token:", error);
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      console.warn("🚫 No Token Found - Redirecting to Login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      verify(token, process.env.JWT_SECRET!);
      console.log("✅ Token Verified - Allow Access to Dashboard");
      return NextResponse.next();
    } catch (error) {
      console.error("❌ Invalid Token - Redirecting to Login", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to these routes
export const config = {
  matcher: ["/dashboard", "/login", "/register"],
};
