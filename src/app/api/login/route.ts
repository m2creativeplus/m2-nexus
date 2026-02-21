import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const formData = await request.formData();
  const password = formData.get("password");

  // Simple mock authentication - in production, use environment variables and proper hashing
  if (password === "sovereign" || password === "admin" || password === "m2nexus") {
    // Set a secure HTTP-only cookie
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("nexus_auth_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return response;
  }

  return NextResponse.redirect(new URL("/login?error=Invalid clearance code", request.url));
}
