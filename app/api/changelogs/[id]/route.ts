import { NextResponse } from 'next/server';
import { getChangelog } from '@/app/lib/data';

// GET handler to retrieve a specific changelog
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: changelogId } = params;
    
    if (!changelogId) {
      return NextResponse.json(
        { error: 'Changelog ID is required' },
        { status: 400 }
      );
    }
    
    const changelog = await getChangelog(changelogId);
    
    if (!changelog) {
      return NextResponse.json(
        { error: 'Changelog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ changelog });
  } catch (error) {
    console.error(`Error fetching changelog:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch changelog' },
      { status: 500 }
    );
  }
} 