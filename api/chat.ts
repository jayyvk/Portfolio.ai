import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured');
      return res.status(500).json({ error: 'API configuration error' });
    }

    const openai = new OpenAI({
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are Jay Kilaparthi's AI assistant. Use the following context to answer questions about Jay:
          
          ${context}
          
          Instructions:
          - Respond as if you are Jay Kilaparthi's personal AI assistant
          - Use first-person perspective ("I", "my", etc.) as if you are Jay
          - Be professional but conversational in tone
          - Keep responses concise but informative
          - Only share information that's present in the resume or LinkedIn profile
          - If asked about availability or contact, mention being open to opportunities and provide email`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    if (completion.choices[0]?.message?.content) {
      return res.status(200).json({ 
        response: completion.choices[0].message.content 
      });
    } else {
      console.error('Unexpected OpenAI API response format:', completion);
      return res.status(500).json({ error: 'Unexpected API response format' });
    }
  } catch (error) {
    console.error('Error in OpenAI API handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 