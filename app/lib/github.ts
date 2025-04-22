import { Octokit } from 'octokit';
import { Commit } from './types';

// Parse GitHub repository URL to extract owner and repo
function parseRepoUrl(url: string) {
  // Handle different GitHub URL formats
  // https://github.com/owner/repo
  // git@github.com:owner/repo.git
  // etc.
  
  let owner = '';
  let repo = '';
  
  if (url.includes('github.com')) {
    // Remove trailing .git if present
    const cleanUrl = url.replace(/\.git$/, '');
    
    // Extract owner and repo from URL
    if (cleanUrl.includes('github.com/')) {
      const parts = cleanUrl.split('github.com/')[1].split('/');
      owner = parts[0];
      repo = parts[1];
    } else if (cleanUrl.includes('github.com:')) {
      const parts = cleanUrl.split('github.com:')[1].split('/');
      owner = parts[0];
      repo = parts[1];
    }
  }
  
  return { owner, repo };
}

// Fetch commits from GitHub repository
export async function fetchCommits(repositoryUrl: string): Promise<Commit[]> {
  const octokit = new Octokit();
  const { owner, repo } = parseRepoUrl(repositoryUrl);
  
  if (!owner || !repo) {
    throw new Error('Invalid GitHub repository URL');
  }
  
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner,
      repo,
      per_page: 100, // Fetch up to 100 commits
    });
    
    if (response.status !== 200) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }
    
    return response.data.map((item: any) => ({
      id: item.sha,
      message: item.commit.message,
      author: item.commit.author.name,
      date: item.commit.author.date,
    }));
  } catch (error) {
    console.error('Error fetching commits:', error);
    throw error;
  }
}

// Optional: Fetch repository details
export async function fetchRepositoryDetails(repositoryUrl: string) {
  const octokit = new Octokit();
  const { owner, repo } = parseRepoUrl(repositoryUrl);
  
  if (!owner || !repo) {
    throw new Error('Invalid GitHub repository URL');
  }
  
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
    });
    
    if (response.status !== 200) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }
    
    return {
      name: response.data.name,
      fullName: response.data.full_name,
      description: response.data.description,
      url: response.data.html_url,
    };
  } catch (error) {
    console.error('Error fetching repository details:', error);
    throw error;
  }
} 