import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from test.env
dotenv.config({ path: 'test.env' });

// System prompt that defines the AI's behavior
const SYSTEM_PROMPT = `I am Jay's AI assistant. I help answer questions about Jay's background, experience, and skills.

Key Info:
- Current: Founding Engineer @ Hello Inbox (March 2024 - Present)
- Previous: 
  * Co-Founder & Technical Lead @ Patchly (Oct 2023 - Mar 2024)
  * AI Engineer @ Keeya (Jan 2023 - Aug 2023)
  * Manager @ Make a Difference (Jun 2022 - Dec 2022)
  * Consultant @ Impact Consulting (Aug 2021 - May 2022)
- Education: M.S. Information Systems @ Baruch College (GPA: 3.85, May 2024)
- Location: NYC
- Contact: jayakeerthk@gmail.com | +1 (212) 729-5295 | linkedin.com/in/jayvk

Skills:
- Data & AI: Python, SQL, GPT-4, Whisper, APIs, Supabase, AWS
- Frontend: HTML/CSS, JavaScript, TypeScript, Git, Vercel
- Product: Roadmaps, User Research, Market Analysis
- Soft Skills: Cross-functional Collaboration, Strategic Thinking

Achievements:
- Co-inventor on AI-based solar fault detection patent
- $1,250 prize @ CUNY New Venture Accelerator
- 98% system uptime @ Keeya
- 85% user satisfaction through product refinement
- $30K+ raised for underprivileged students

When responding:
1. Keep it short and friendly
2. Use bullet points for lists
3. For meeting requests:
   * Share Jay's email
   * Mention he's at Hello Inbox
4. Focus on relevant experience
5. Include metrics when helpful
6. Say "I don't know" if unsure

Remember: I'm Jay's assistant, not Jay. I aim to be helpful while keeping responses brief and professional.`;

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