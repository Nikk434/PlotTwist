export async function GET(request) {
  try {
    // Forward request to FastAPI with cookies
    const response = await fetch('https://plottwist-x4aw.onrender.com/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.detail || 'Unauthorized' }),
        { status: response.status }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (error) {
    console.error('Error in /auth/me:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}