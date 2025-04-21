import fs from 'fs';
import path from 'path';
import { Project, Changelog } from './types';

const dataFile = path.join(process.cwd(), 'data', 'store.json');

// Helper function to read the data store
function readDataStore() {
  if (!fs.existsSync(dataFile)) {
    // Initialize with empty data if file doesn't exist
    fs.writeFileSync(dataFile, JSON.stringify({ projects: [], changelogs: [] }));
  }
  
  const rawData = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(rawData);
}

// Helper function to write to the data store
function writeDataStore(data: any) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// Projects
export function getProjects(): Project[] {
  const data = readDataStore();
  return data.projects;
}

export function getProject(id: string): Project | null {
  const projects = getProjects();
  return projects.find(project => project.id === id) || null;
}

export function addProject(project: Omit<Project, 'id' | 'createdAt'>) {
  const data = readDataStore();
  const newProject = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  data.projects.push(newProject);
  writeDataStore(data);
  return newProject;
}

// Changelogs
export function getChangelogs(): Changelog[] {
  const data = readDataStore();
  return data.changelogs;
}

export function getProjectChangelogs(projectId: string): Changelog[] {
  const changelogs = getChangelogs();
  return changelogs.filter(changelog => changelog.projectId === projectId);
}

export function addChangelog(changelog: Omit<Changelog, 'id' | 'createdAt'>) {
  const data = readDataStore();
  const newChangelog = {
    ...changelog,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  data.changelogs.push(newChangelog);
  writeDataStore(data);
  return newChangelog;
} 