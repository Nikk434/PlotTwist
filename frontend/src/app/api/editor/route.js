import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const storyData = await request.json();
    
    console.log('Submitting story:', storyData);

    // Forward to FastAPI backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/story/submit`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(storyData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.detail || 'Failed to submit story' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Story submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}