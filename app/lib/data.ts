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

// Debug helper
const logStore = () => {
  console.log('Current store state:');
  console.log('Projects:', store.projects.length);
  console.log('Project IDs:', store.projects.map(p => p.id));
};

// Projects
export function getProjects(): Project[] {
  console.log('getProjects called, returning', store.projects.length, 'projects');
  return [...store.projects];
}

export function getProject(id: string): Project | null {
  console.log('getProject called with id:', id);
  const project = store.projects.find(project => project.id === id);
  console.log('Project found:', !!project);
  return project || null;
}

export function addProject(project: Omit<Project, 'id' | 'createdAt'>) {
  console.log('Adding new project:', project.name);
  const newProject = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  store.projects.push(newProject);
  console.log('Project added with ID:', newProject.id);
  logStore();
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
  console.log('Resetting data store to empty state');
  store = {
    projects: [],
    changelogs: []
  };
} 