// app/auth/login/route.js
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const res = await fetch(`https://plottwist-x4aw.onrender.com/auth/login`, {
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

    // FOR DEV 
    // cookieStore.set({
    //   name: "access_token",
    //   value: accessToken,
    //   httpOnly: true,
    //   secure: false, // change to true in production
    //   sameSite: "lax",
    //   maxAge: 15 * 60,
    //   path: "/",
    // });

    // // Refresh token cookie
    // cookieStore.set({
    //   name: "refresh_token",
    //   value: refreshToken,
    //   httpOnly: true,
    //   secure: false, // change to true in production
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60,
    //   path: "/",
    // });



    // FOR PROD
    cookieStore.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      secure: true,             // MUST be true in production (HTTPS)
      sameSite: "none",         // Allows cross-origin cookies
      maxAge: 15 * 60,
      path: "/",
    });

    cookieStore.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: true,             // same here
      sameSite: "none",         // same here
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });




    return new Response(JSON.stringify({ message: "Login successful" }), { status: 200 });

  } catch (error) {
    console.error("Error in /auth/login:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
