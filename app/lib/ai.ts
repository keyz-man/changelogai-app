import { Project, Commit } from './types';

interface GenerateChangelogParams {
  project: Project;
  selectedCommits: Commit[];
  fromDate: string;
  toDate: string;
}

interface GeneratedChangelog {
  title: string;
  content: string;
}

/**
 * Generates a changelog using Google Gemini AI based on the selected commits
 */
export async function generateChangelogWithAI({
  project,
  selectedCommits,
  fromDate,
  toDate,
}: GenerateChangelogParams): Promise<GeneratedChangelog> {
  // Check if API key is configured
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      "Missing Google AI API key. Please add your Gemini API key to .env.local file as GOOGLE_AI_API_KEY."
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

    // In Next.js, we should use a server API route to make this call
    // to avoid exposing the API key to the client
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate changelog with AI');
    }

    const data = await response.json();
    
    return {
      title: data.title,
      content: data.content,
    };
  } catch (error: any) {
    console.error('Error generating changelog with AI:', error);
    throw new Error(`Failed to generate changelog: ${error.message}`);
  }
} 