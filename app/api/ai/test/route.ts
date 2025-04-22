import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if API key is configured
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }
    
    console.log('Testing with Gemini 2.0 API');
    
    // Simple test request to the Gemini 2.0 API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Write a simple hello world message',
              },
            ],
          },
        ],
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API test error:', errorData);
      return NextResponse.json(
        { 
          success: false,
          error: `API test failed: ${errorData.error?.message || 'Unknown error'}`,
          statusCode: response.status,
          apiKey: apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4)
        },
        { status: 500 }
      );
    }
    
    // Get the response text
    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    return NextResponse.json({
      success: true,
      message: 'API key is working properly',
      apiKey: apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4),
      sample: responseText.substring(0, 50) + '...'
    });
  } catch (error: any) {
    console.error('API test error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 