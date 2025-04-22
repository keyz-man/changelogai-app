import { NextResponse } from 'next/server';
import { getProject } from '@/app/lib/data';

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
      // Format the commit messages for the prompt
      const commitMessages = selectedCommits.map((commit) => {
        return `- ${commit.message} (${commit.author}, ${new Date(commit.date).toISOString().split('T')[0]})`;
      }).join('\n');

      // Prepare the prompt for Gemini
      const prompt = `
You are an expert changelog generator.

Project Name: ${project.name}
Project Description: ${project.description || 'N/A'}
Commit Period: ${fromDate} to ${toDate}

I will provide you with a list of commit messages from a Git repository. 
Your task is to analyze these commits and create a concise, well-organized changelog.

Please follow these guidelines:
1. Create a clear, descriptive title for this changelog.
2. Organize the changes into categories like 'Features', 'Bug Fixes', 'Improvements', etc.
3. Summarize similar commits together.
4. Focus on user-facing changes, but include significant backend work.
5. Keep the language professional and consistent.

Here are the commits:
${commitMessages}

Output format:
{
  "title": "Your generated title here",
  "content": "The changelog content with sections and formatting"
}
`;

      // Call our internal AI generation endpoint
      const aiResponse = await fetch(new URL('/api/ai/generate', request.url).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        return NextResponse.json(
          { error: errorData.error || 'Failed to generate AI changelog' },
          { status: 500 }
        );
      }
      
      const generatedData = await aiResponse.json();
      
      return NextResponse.json({ 
        generated: {
          title: generatedData.title,
          content: generatedData.content
        }
      });
    } catch (error: any) {
      // Handle specific errors from the AI generation
      console.error('Error generating changelog with AI:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to generate changelog' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate changelog' },
      { status: 500 }
    );
  }
} 