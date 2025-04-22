'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import AddProjectForm from '@/app/components/AddProjectForm';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Project } from '@/app/lib/types';

export default function DeveloperDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data.projects);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main>
      <Header title="ChangelogAI" subtitle="Developer Dashboard" />

      <section className="container" style={{ padding: '40px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>Your Projects</h2>
          <button onClick={openModal}>Add New Project</button>
        </div>
        
        <div style={{ marginBottom: '40px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <p>Loading projects...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                style={{ marginTop: '20px' }}
              >
                Retry
              </button>
            </div>
          ) : projects.length > 0 ? (
            <div className="projects-list">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  style={{ 
                    marginBottom: '20px', 
                    padding: '15px', 
                    border: '1px solid #eee',
                    borderRadius: '5px'
                  }}
                >
                  <h3 style={{ marginBottom: '10px' }}>
                    <Link href={`/developer/projects/${project.id}`}>
                      {project.name}
                    </Link>
                  </h3>
                  {project.description && (
                    <p style={{ marginBottom: '10px' }}>{project.description}</p>
                  )}
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Repository: <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                      {project.repositoryUrl}
                    </a>
                  </p>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Added: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: '14px', marginTop: '5px' }}>
                    {project.commits.length} commits
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <p style={{ marginBottom: '20px' }}>No projects yet. Get started by adding a GitHub repository.</p>
            </div>
          )}
        </div>
      </section>

      <AddProjectForm isOpen={isModalOpen} onClose={closeModal} />
      
      <Footer />
    </main>
  );
} 