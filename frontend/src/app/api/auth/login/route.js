// app/auth/login/route.js
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const res = await fetch(`http://localhost:8000/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return new Response(JSON.stringify({ error: errorData.detail || "Login failed" }), {
        status: res.status,
      });
    }

    const data = await res.json();
    // console.log("DATA + + + + ",data);
    
    // Assuming backend returns access_token and refresh_token in body
    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    const profile_usename = data.username;
    const cookieStore = await cookies();

    // Access token cookie
    cookieStore.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    // Refresh token cookie
    cookieStore.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return new Response(JSON.stringify({ message: "Login successful" }), { status: 200 });

  } catch (error) {
    console.error("Error in /auth/login:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
