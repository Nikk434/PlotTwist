import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("access_token");

    cookieStore.delete("refresh_token");

    return new Response(
      JSON.stringify({ message: "Logged out successfully" }), 
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in /auth/logout:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500 }
    );
  }
}