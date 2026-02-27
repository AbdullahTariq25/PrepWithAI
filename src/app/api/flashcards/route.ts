import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filter: Record<string, unknown> = {};
    if (category && category !== 'All') {
      filter.category = category.toLowerCase().replace(/\s+/g, '-');
    }

    const questions = await Question.find(filter)
      .select('title description difficulty category hints')
      .limit(limit)
      .lean();

    const flashcards = questions.map((q: unknown) => {
      const question = q as { _id: { toString(): string }; title: string; description: string; difficulty: string; category: string; hints: string[] };
      return {
        id: question._id.toString(),
        front: question.title + ': ' + question.description,
        back: Array.isArray(question.hints) && question.hints.length > 0
          ? question.hints.join('. ') + '.'
          : 'Review the solution approach for this problem.',
        category: question.category || 'general',
        difficulty: question.difficulty || 'medium',
        mastered: false,
      };
    });

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Flashcards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}
