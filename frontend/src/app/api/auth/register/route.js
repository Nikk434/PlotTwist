
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("BOD = =  =",body );
    
    console.log("Bob");
    
    const backendRes = await fetch(`http://127.0.0.1:8000/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    return new Response(JSON.stringify(data), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error in /auth/register route:", err);
    return new Response(
      JSON.stringify({ detail: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
