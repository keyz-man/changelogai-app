import { NextResponse } from 'next/server';
import { getProject } from '@/app/lib/data';
import { generateChangelogWithAI } from '@/app/lib/ai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, commitIds, fromDate, toDate } = body;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    if (!commitIds || !Array.isArray(commitIds) || commitIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one commit ID is required' },
        { status: 400 }
      );
    }
    
    if (!fromDate || !toDate) {
      return NextResponse.json(
        { error: 'Date range is required' },
        { status: 400 }
      );
    }
    
    // Get the project to access its commits
    const project = await getProject(projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Filter the commits based on the provided commit IDs
    const selectedCommits = project.commits.filter(commit => 
      commitIds.includes(commit.id)
    );
    
    if (selectedCommits.length === 0) {
      return NextResponse.json(
        { error: 'None of the provided commit IDs were found' },
        { status: 400 }
      );
    }
    
    try {
      // Generate the changelog using AI
      const generatedChangelog = await generateChangelogWithAI({
        project,
        selectedCommits,
        fromDate,
        toDate
      });
      
      return NextResponse.json({ 
        generated: generatedChangelog 
      });
    } catch (error: any) {
      // Handle specific errors from the AI generation
      if (error.message.includes('Missing Google AI API key')) {
        return NextResponse.json(
          { 
            error: 'AI generation failed: API key not configured',
            details: error.message
          },
          { status: 500 }
        );
      }
      
      throw error; // Re-throw other errors to be handled by the outer catch
    }
  } catch (error: any) {
    console.error('Error generating changelog with AI:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate changelog' },
      { status: 500 }
    );
  }
} 