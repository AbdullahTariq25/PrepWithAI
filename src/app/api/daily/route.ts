import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get 6 random questions as daily challenges
    // Mix of difficulties and categories
    const easyQuestions = await Question.aggregate([
      { $match: { difficulty: 'easy' } },
      { $sample: { size: 2 } },
    ]);

    const mediumQuestions = await Question.aggregate([
      { $match: { difficulty: 'medium' } },
      { $sample: { size: 3 } },
    ]);

    const hardQuestions = await Question.aggregate([
      { $match: { difficulty: 'hard' } },
      { $sample: { size: 1 } },
    ]);

    const challenges = [...easyQuestions, ...mediumQuestions, ...hardQuestions].map((q, i) => ({
      id: q._id.toString(),
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      category: q.category,
      type: q.category === 'behavioral' ? 'behavioral' : q.category === 'system-design' ? 'system-design' : 'coding',
      timeLimit: q.timeLimit || 20,
      points: q.difficulty === 'easy' ? 30 : q.difficulty === 'medium' ? 75 : 150,
      completedBy: Math.floor(Math.random() * 2000) + 100,
      isCompleted: false,
      isLocked: i >= 4,
    }));

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error('Daily challenge error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily challenges' },
      { status: 500 }
    );
  }
}
