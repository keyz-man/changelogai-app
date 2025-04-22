import { NextResponse } from 'next/server';
import { getProject, getProjectChangelogs } from '@/app/lib/data';

// GET handler to retrieve a specific project and its commits
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const project = getProject(projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Get changelogs for this project
    const changelogs = getProjectChangelogs(projectId);
    
    return NextResponse.json({ 
      project,
      changelogs
    });
  } catch (error) {
    console.error(`Error fetching project ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
} 