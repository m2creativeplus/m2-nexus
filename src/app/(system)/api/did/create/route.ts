import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, persona } = await req.json();
    const apiKey = process.env.DID_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'DID_API_KEY is missing in environment variables.' }, { status: 500 });
    }

    // Determine avatar image and voice based on persona
    // Using D-ID default presenters as safe fallbacks
    const sourceUrl = persona === 'mahmoud' 
      ? 'https://create-images-results.d-id.com/DefaultPresenters/Matt_f/image.jpeg' 
      : 'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg';

    const voiceId = persona === 'mahmoud' ? 'en-US-ChristopherNeural' : 'en-US-JennyNeural';

    // D-ID Authentication requires Basic Auth (Username:Password base64 encoded)
    // The API key is usually provided as string "key:secret", which we then base64 encode
    const authString = Buffer.from(apiKey).toString('base64');

    const response = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: text,
          provider: {
            type: 'microsoft',
            voice_id: voiceId
          }
        },
        config: {
          fluent: 'false',
          pad_audio: '0.0'
        },
        source_url: sourceUrl
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.description || 'API Error' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("D-ID Create Error:", error);
    return NextResponse.json({ error: 'Failed to create D-ID talk' }, { status: 500 });
  }
}
