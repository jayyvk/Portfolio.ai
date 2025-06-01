import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userInput, context } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'User input is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return res.status(500).json({ error: 'API configuration error' });
    }

    const requestBody = {
      contents: [
        {
          parts: [
            { text: context }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return res.status(response.status).json({ error: 'Gemini API error', details: errorText });
    }

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ 
        response: data.candidates[0].content.parts[0].text 
      });
    } else {
      console.error('Unexpected Gemini API response format:', data);
      return res.status(500).json({ error: 'Unexpected API response format' });
    }
  } catch (error) {
    console.error('Error in Gemini API handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 