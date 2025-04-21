export interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  repositoryUrl: string;
  commits: Commit[];
  createdAt: string;
}

export interface Changelog {
  id: string;
  projectId: string;
  title: string;
  content: string;
  fromDate: string;
  toDate: string;
  createdAt: string;
} 