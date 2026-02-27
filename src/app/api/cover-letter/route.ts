import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyName, jobTitle, jobDescription, tone, keySkills, whyCompany } = await request.json();

    if (!companyName || !jobTitle) {
      return NextResponse.json(
        { error: 'Company name and job title are required' },
        { status: 400 }
      );
    }

    const prompt = `Generate a professional cover letter for the following:
Company: ${companyName}
Job Title: ${jobTitle}
${jobDescription ? `Job Description: ${jobDescription}` : ''}
${keySkills ? `Key Skills to Highlight: ${keySkills}` : ''}
${whyCompany ? `Why This Company: ${whyCompany}` : ''}
Tone: ${tone || 'professional'}

Write a compelling, ATS-friendly cover letter that:
1. Opens with a strong hook
2. Highlights relevant skills and experience
3. Shows genuine interest in the company
4. Includes specific examples and achievements
5. Closes with a clear call to action
6. Is 3-4 paragraphs, under 400 words

Return ONLY the letter text, no subject line or headers.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach who writes compelling, personalized cover letters for software engineers. Write in a natural, authentic voice.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const letter = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ letter });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
