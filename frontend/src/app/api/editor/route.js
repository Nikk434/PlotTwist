export async function POST(request) {
  try {
    const data = await request.json()
    console.log("DATA = =  =",data);
    
    
    // Validate data
    if (!data.sections || !data.metadata) {
      return Response.json({ error: 'Invalid data' }, { status: 400 })
    }
    
    // Process/save data (database, file, etc.)
    // const saved = await saveToDatabase(data)
    
    return Response.json({ 
      success: true, 
      message: 'Treatment saved successfully',
      // data: saved 
    })
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}