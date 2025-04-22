import { NextResponse } from 'next/server';
import { addProject, getProjects } from '@/app/lib/data';
import { fetchCommits, fetchRepositoryDetails } from '@/app/lib/github';

// GET handler to retrieve all projects
export async function GET() {
  try {
    const projects = getProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST handler to create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, repositoryUrl } = body;
    
    if (!repositoryUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      );
    }
    
    // Fetch repository details and commits
    const [repoDetails, commits] = await Promise.all([
      fetchRepositoryDetails(repositoryUrl),
      fetchCommits(repositoryUrl),
    ]);
    
    // Create the new project
    const newProject = addProject({
      // Use provided name or fallback to repo name
      name: name || repoDetails.name || 'Unnamed Project',
      description: description || repoDetails.description || '',
      repositoryUrl,
      commits,
    });
    
    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
} 