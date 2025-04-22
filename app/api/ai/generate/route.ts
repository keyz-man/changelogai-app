import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      console.error('Missing Google AI API key in server environment');
      return NextResponse.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      );
    }
    
    console.log('Making request to Gemini 2.0 API');
    
    // Make direct request to Google Gemini API - using Gemini 2.0 Flash
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
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: `Gemini API error: ${errorData.error?.message || 'Unknown error'}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Parse the response
    let textResponse = data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini response:', textResponse);
    
    // Check if response is in JSON format or needs parsing
    let parsedResponse;
    try {
      // Try to parse if response is in JSON format
      // Clean the text in case it contains markdown code blocks
      textResponse = textResponse.replace(/```json|```/g, '').trim();
      parsedResponse = JSON.parse(textResponse);
    } catch (e) {
      console.log('Error parsing JSON response, attempting manual extraction');
      // If parsing fails, attempt to extract title and content manually
      const titleMatch = textResponse.match(/["']title["']\s*:\s*["'](.+?)["']/);
      const contentMatch = textResponse.match(/["']content["']\s*:\s*["'](.+?)["']/);
      
      if (titleMatch || contentMatch) {
        parsedResponse = {
          title: titleMatch ? titleMatch[1] : 'Changelog Update',
          content: contentMatch ? contentMatch[1].replace(/\\n/g, '\n') : textResponse,
        };
      } else {
        // If no pattern matches, use the whole text as content
        parsedResponse = {
          title: 'Changelog Update',
          content: textResponse,
        };
      }
    }
    
    return NextResponse.json({
      title: parsedResponse.title,
      content: parsedResponse.content,
    });
  } catch (error: any) {
    console.error('Server error generating AI response:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate changelog' },
      { status: 500 }
    );
  }
} 