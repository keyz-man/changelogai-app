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

    // Make request to Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Parse the response
    let textResponse = data.candidates[0].content.parts[0].text;
    
    // Check if response is in JSON format or needs parsing
    let parsedResponse;
    try {
      // Try to parse if response is in JSON format
      // Clean the text in case it contains markdown code blocks
      textResponse = textResponse.replace(/```json|```/g, '').trim();
      parsedResponse = JSON.parse(textResponse);
    } catch (e) {
      // If parsing fails, attempt to extract title and content manually
      const titleMatch = textResponse.match(/["']title["']\s*:\s*["'](.+?)["']/);
      const contentMatch = textResponse.match(/["']content["']\s*:\s*["'](.+?)["']/);
      
      parsedResponse = {
        title: titleMatch ? titleMatch[1] : `${project.name} Update`,
        content: contentMatch ? contentMatch[1].replace(/\\n/g, '\n') : textResponse,
      };
    }

    return {
      title: parsedResponse.title,
      content: parsedResponse.content,
    };
  } catch (error: any) {
    console.error('Error generating changelog with AI:', error);
    throw new Error(`Failed to generate changelog: ${error.message}`);
  }
} 