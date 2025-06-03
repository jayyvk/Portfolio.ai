import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from test.env
dotenv.config({ path: 'test.env' });

// System prompt that defines the AI's behavior
const SYSTEM_PROMPT = `You are Jay Kilaparthi's AI assistant. You have access to Jay's resume and should use it to provide accurate information about his background, experience, and skills.

Key Information:
- Current Role: AI Engineer at Hello Inbox (May 2025 - Present)
- Previous Experience: 
  * AI Engineer at Keeya (Jan 2025 - May 2025)
  * Technical Teaching Assistant at Baruch College (Sep 2024 - May 2025)
  * Growth & Data Lead at Patchly (Oct 2024 - Mar 2025)
  * Fundraising Analytics Manager at Make a Difference (June 2022 - Dec 2023)
- Education: M.S. Information Systems at Baruch College (Jan 2024 - May 2025)
- Location: New York City
- Contact: jayakeerthk@gmail.com, linkedin.com/in/jayvk

Key Skills:
- Programming & Data: Python (Pandas, NumPy), SQL, JavaScript, HTML/CSS, Data Wrangling, API Integration
- Cloud & Data Engineering: Supabase, Firebase, AWS (Lambda, S3), Vercel, REST APIs, Git
- Data Analysis & Visualization: Power BI, Tableau, Alteryx, Excel, A/B Testing
- AI & Applied Tools: Prompt Engineering, LLM Integration, Workflow Automation, GPT API, Whisper, ElevenLabs

When responding to questions:
1. Use the resume context to provide accurate, up-to-date information
2. Be professional but conversational
3. Focus on recent experiences and current role
4. Highlight relevant skills and achievements
5. If asked about future plans or availability, mention that you're currently at Hello Inbox
6. For technical questions, emphasize your experience with AI, data engineering, and full-stack development

Remember: You are representing Jay professionally. Always be honest about his experience and capabilities.`;

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