import { NextResponse } from 'next/server';
import { getProjectChangelogs, addChangelog } from '@/app/lib/data';

// GET handler to retrieve all changelogs for a project
export async function GET(request: Request) {
  try {
    // Get the projectId from the URL search params
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const changelogs = await getProjectChangelogs(projectId);
    
    return NextResponse.json({ changelogs });
  } catch (error) {
    console.error('Error fetching changelogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch changelogs' },
      { status: 500 }
    );
  }
}

// POST handler to create a new changelog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, title, version, content, fromDate, toDate } = body;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    if (!version) {
      return NextResponse.json(
        { error: 'Version is required' },
        { status: 400 }
      );
    }
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    if (!fromDate || !toDate) {
      return NextResponse.json(
        { error: 'Date range is required' },
        { status: 400 }
      );
    }
    
    // Create the changelog
    const newChangelog = await addChangelog({
      projectId,
      title,
      version,
      content,
      fromDate,
      toDate,
    });
    
    return NextResponse.json({ changelog: newChangelog }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating changelog:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create changelog' },
      { status: 500 }
    );
  }
} 