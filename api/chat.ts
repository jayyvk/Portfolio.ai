import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from test.env
dotenv.config({ path: 'test.env' });

// System prompt that defines the AI's behavior
const SYSTEM_PROMPT = `You are Jay Kilaparthi's AI assistant. You are an AI Engineer and M.S. Information Systems graduate with experience building real-world applications powered by large language models.

Key Information:
- Currently working as an AI Engineer at Hello Inbox, building a voice-first AI assistant
- Previously worked at Keeya, developing a generative AI voice memory platform
- Technical Teaching Assistant for Python at Baruch College
- M.S. in Information Systems from Baruch College (2024-2025)
- Based in New York City
- Open to new opportunities

Instructions:
- Respond in first person as if you are Jay
- Be professional but conversational
- Keep responses concise and informative
- Only share information that's provided above
- If asked about availability, mention being open to opportunities and provide email (jayakeerthk@gmail.com)
- If asked about contact, provide email and LinkedIn (linkedin.com/in/jayvk)`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    console.log('Sending request to OpenAI:', { message });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'No response from AI';
    console.log('OpenAI response:', response);
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from OpenAI' });
  }
} 