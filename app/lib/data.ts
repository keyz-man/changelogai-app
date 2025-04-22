// In-memory data store for development purposes
// Note: In a production app, this would be replaced with a database

import { prisma } from './db';
import { Project, Changelog, Commit } from './types';

// Projects
export async function getProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    include: {
      commits: true,
    },
  });
  
  return projects.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    repositoryUrl: project.repositoryUrl,
    commits: project.commits.map(commit => ({
      id: commit.id,
      message: commit.message,
      author: commit.author,
      date: commit.date.toISOString(),
    })),
    createdAt: project.createdAt.toISOString(),
  }));
}

export async function getProject(id: string): Promise<Project | null> {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      commits: true,
    },
  });
  
  if (!project) return null;
  
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    repositoryUrl: project.repositoryUrl,
    commits: project.commits.map(commit => ({
      id: commit.id,
      message: commit.message,
      author: commit.author,
      date: commit.date.toISOString(),
    })),
    createdAt: project.createdAt.toISOString(),
  };
}

export async function addProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  const { commits, ...projectData } = project;
  
  const newProject = await prisma.project.create({
    data: {
      name: projectData.name,
      description: projectData.description,
      repositoryUrl: projectData.repositoryUrl,
      commits: {
        create: commits.map(commit => ({
          message: commit.message,
          author: commit.author,
          date: new Date(commit.date),
        })),
      },
    },
    include: {
      commits: true,
    },
  });
  
  return {
    id: newProject.id,
    name: newProject.name,
    description: newProject.description,
    repositoryUrl: newProject.repositoryUrl,
    commits: newProject.commits.map(commit => ({
      id: commit.id,
      message: commit.message,
      author: commit.author,
      date: commit.date.toISOString(),
    })),
    createdAt: newProject.createdAt.toISOString(),
  };
}

// Implement delete project function
export async function deleteProject(id: string): Promise<boolean> {
  try {
    await prisma.project.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}

// Changelogs
export async function getChangelogs(): Promise<Changelog[]> {
  const changelogs = await prisma.changelog.findMany();
  
  return changelogs.map(changelog => ({
    id: changelog.id,
    projectId: changelog.projectId,
    title: changelog.title,
    version: changelog.version,
    content: changelog.content,
    fromDate: changelog.fromDate.toISOString(),
    toDate: changelog.toDate.toISOString(),
    createdAt: changelog.createdAt.toISOString(),
  }));
}

export async function getProjectChangelogs(projectId: string): Promise<Changelog[]> {
  const changelogs = await prisma.changelog.findMany({
    where: { projectId },
  });
  
  return changelogs.map(changelog => ({
    id: changelog.id,
    projectId: changelog.projectId,
    title: changelog.title,
    version: changelog.version,
    content: changelog.content,
    fromDate: changelog.fromDate.toISOString(),
    toDate: changelog.toDate.toISOString(),
    createdAt: changelog.createdAt.toISOString(),
  }));
}

export async function getChangelog(id: string): Promise<Changelog | null> {
  const changelog = await prisma.changelog.findUnique({
    where: { id },
  });
  
  if (!changelog) return null;
  
  return {
    id: changelog.id,
    projectId: changelog.projectId,
    title: changelog.title,
    version: changelog.version,
    content: changelog.content,
    fromDate: changelog.fromDate.toISOString(),
    toDate: changelog.toDate.toISOString(),
    createdAt: changelog.createdAt.toISOString(),
  };
}

export async function addChangelog(changelog: Omit<Changelog, 'id' | 'createdAt'>): Promise<Changelog> {
  const newChangelog = await prisma.changelog.create({
    data: {
      projectId: changelog.projectId,
      title: changelog.title,
      version: changelog.version,
      content: changelog.content,
      fromDate: new Date(changelog.fromDate),
      toDate: new Date(changelog.toDate),
    },
  });
  
  return {
    id: newChangelog.id,
    projectId: newChangelog.projectId,
    title: newChangelog.title,
    version: newChangelog.version,
    content: newChangelog.content,
    fromDate: newChangelog.fromDate.toISOString(),
    toDate: newChangelog.toDate.toISOString(),
    createdAt: newChangelog.createdAt.toISOString(),
  };
} 