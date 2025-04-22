'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Project } from '@/app/lib/types';

export default function PublicProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data.projects);
        setFilteredProjects(data.projects);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm, projects]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const viewProjectChangelogs = (projectId: string) => {
    router.push(`/public/projects/${projectId}`);
  };

  return (
    <main>
      <Header title="ChangelogAI" subtitle="Browse Projects" />

      <section className="container" style={{ padding: '40px 0' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>All Projects</h2>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
            <p>{error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>{searchTerm ? 'No projects match your search.' : 'No projects available.'}</p>
          </div>
        ) : (
          <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                className="project-card"
                style={{ 
                  border: '1px solid #eee', 
                  borderRadius: '5px', 
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  cursor: 'pointer'
                }}
                onClick={() => viewProjectChangelogs(project.id)}
              >
                <h3 style={{ marginBottom: '10px' }}>{project.name}</h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#666', 
                  marginBottom: '15px', 
                  minHeight: '40px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {project.description}
                </p>
                <div style={{ fontSize: '13px', color: '#999' }}>
                  <p>Added: {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
} 