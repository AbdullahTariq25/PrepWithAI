import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// In a full implementation, this would use a StudyGroup model
// For now, return mock data that matches the frontend interface
const MOCK_GROUPS = [
  {
    id: '1',
    name: 'FAANG Interview Prep',
    description: 'Daily DSA practice and mock interviews targeting FAANG companies.',
    members: 24,
    maxMembers: 30,
    category: 'Interview Prep',
    isPublic: true,
    lastActive: '2 mins ago',
    nextSession: 'Tomorrow 7:00 PM EST',
    tags: ['DSA', 'System Design', 'Mock Interviews'],
    createdBy: 'Alex Chen',
  },
  {
    id: '2',
    name: 'System Design Masters',
    description: 'Deep dive into system design concepts.',
    members: 18,
    maxMembers: 25,
    category: 'System Design',
    isPublic: true,
    lastActive: '15 mins ago',
    nextSession: 'Saturday 2:00 PM EST',
    tags: ['Distributed Systems', 'Scalability'],
    createdBy: 'Sarah Kim',
  },
  {
    id: '3',
    name: 'Frontend Interview Club',
    description: 'React, JavaScript, and frontend system design.',
    members: 31,
    maxMembers: 40,
    category: 'Frontend',
    isPublic: true,
    lastActive: '1 hour ago',
    nextSession: 'Wednesday 6:00 PM EST',
    tags: ['React', 'JavaScript', 'TypeScript'],
    createdBy: 'Mike Johnson',
  },
];

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ groups: MOCK_GROUPS });
  } catch (error) {
    console.error('Study groups error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study groups' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, maxMembers, isPublic } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      );
    }

    // In a full implementation, save to database
    const newGroup = {
      id: Date.now().toString(),
      name,
      description: description || '',
      category: category || 'General',
      members: 1,
      maxMembers: maxMembers || 20,
      isPublic: isPublic !== false,
      lastActive: 'Just now',
      nextSession: null,
      tags: [],
      createdBy: session.user.name || 'Anonymous',
    };

    return NextResponse.json({ group: newGroup }, { status: 201 });
  } catch (error) {
    console.error('Create group error:', error);
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    );
  }
}
