import { NextResponse } from 'next/server';
import { getProject, getProjectChangelogs, deleteProject } from '@/app/lib/data';

// GET handler to retrieve a specific project and its commits
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Fix for the params.id access warning
    const { id: projectId } = params;
    
    // For debugging
    console.log('Looking for project with ID:', projectId);
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const project = await getProject(projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Get changelogs for this project
    const changelogs = await getProjectChangelogs(projectId);
    
    return NextResponse.json({ 
      project,
      changelogs
    });
  } catch (error) {
    console.error(`Error fetching project:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a specific project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: projectId } = params;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deleteProject(projectId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting project:`, error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 