import { NextResponse } from 'next/server'

// export async function POST(request) {
//   try {
//     const settings = await request.json()
//     console.log("Incoming settings:", settings)

//     const {
//       timeLimit,
//       genres,
//       promptType,
//       promptText,
//       wordCap,
//       objectInclusion,
//       reverseChallenge,
//       isBlindPrompt,
//       plotTwistText,
//     } = settings || {}

//     // --- Validation ---
//     if (!timeLimit || typeof timeLimit !== 'number' || timeLimit <= 0) {
//       return NextResponse.json({ success: false, error: 'timeLimit must be a positive number' }, { status: 400 })
//     }

//     if (!Array.isArray(genres) || genres.length === 0) {
//       return NextResponse.json({ success: false, error: 'At least one genre is required' }, { status: 400 })
//     }

//     if (!promptType || typeof promptType !== 'string') {
//       return NextResponse.json({ success: false, error: 'promptType is required' }, { status: 400 })
//     }

//     if (promptType === 'Open Challenge' && (!promptText || typeof promptText !== 'string')) {
//       return NextResponse.json({ success: false, error: 'promptText required for Open Challenge' }, { status: 400 })
//     }

//     if (wordCap && (typeof wordCap !== 'number' || wordCap <= 0)) {
//       return NextResponse.json({ success: false, error: 'wordCap must be a positive number' }, { status: 400 })
//     }

//     if (objectInclusion && typeof objectInclusion !== 'string') {
//       return NextResponse.json({ success: false, error: 'objectInclusion must be a string' }, { status: 400 })
//     }

//     if (typeof reverseChallenge !== 'boolean') {
//       return NextResponse.json({ success: false, error: 'reverseChallenge must be a boolean' }, { status: 400 })
//     }

//     if (typeof isBlindPrompt !== 'boolean') {
//       return NextResponse.json({ success: false, error: 'isBlindPrompt must be a boolean' }, { status: 400 })
//     }

//     if (plotTwistText && typeof plotTwistText !== 'string') {
//       return NextResponse.json({ success: false, error: 'plotTwistText must be a string' }, { status: 400 })
//     }

//     return NextResponse.json({
//       success: true,
//       data: {
//         // matchId,
//         settings,
//       },
//     })
//   } catch (error) {
//     console.error("Match creation error:", error)
//     return NextResponse.json(
//       { success: false, error: 'Server error while creating match' },
//       { status: 500 }
//     )
//   }
// }
export async function POST(request) {
  try {
    const settings = await request.json()
    console.log("Incoming settings:", settings)

    // Forward to FastAPI backend
    const response = await fetch('https://plottwist-x4aw.onrender.com/match/create', {
      method: 'POST',
      credentials: "include",

      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.detail || 'Failed to create match' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error("Match creation error:", error)
    return NextResponse.json(
      { success: false, error: 'Server error while creating match' },
      { status: 500 }
    )
  }
}