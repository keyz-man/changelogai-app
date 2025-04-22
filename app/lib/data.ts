// In-memory data store for development purposes
// Note: In a production app, this would be replaced with a database

import { Project, Changelog } from './types';

// In-memory store
let store: {
  projects: Project[];
  changelogs: Changelog[];
} = {
  projects: [],
  changelogs: []
};

// Projects
export function getProjects(): Project[] {
  return [...store.projects];
}

export function getProject(id: string): Project | null {
  return store.projects.find(project => project.id === id) || null;
}

export function addProject(project: Omit<Project, 'id' | 'createdAt'>) {
  const newProject = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  store.projects.push(newProject);
  return newProject;
}

// Changelogs
export function getChangelogs(): Changelog[] {
  return [...store.changelogs];
}

export function getProjectChangelogs(projectId: string): Changelog[] {
  return store.changelogs.filter(changelog => changelog.projectId === projectId);
}

export function addChangelog(changelog: Omit<Changelog, 'id' | 'createdAt'>) {
  const newChangelog = {
    ...changelog,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  store.changelogs.push(newChangelog);
  return newChangelog;
}

// For development/testing purposes: reset the store
export function resetStore() {
  store = {
    projects: [],
    changelogs: []
  };
} 