export async function validateApiKey(request) {
  const apiKey = request.headers.get('x-api-key');
  
  // Check if API key is provided
  if (!apiKey) {
    return new NextResponse(JSON.stringify({ 
      error: 'Unauthorized',
      message: 'Missing API key' 
    }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Validate against environment variable
  if (apiKey !== process.env.API_KEY) {
    return new NextResponse(JSON.stringify({ 
      error: 'Unauthorized',
      message: 'Invalid API key' 
    }), { 
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return null;
}