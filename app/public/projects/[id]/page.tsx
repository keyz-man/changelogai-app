'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Project, Changelog } from '@/app/lib/types';

export default function PublicProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      setError('');
      
      // Get the project ID from params
      const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
      
      if (!projectId) {
        setError('Project ID is missing');
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch project details');
        }
        
        setProject(data.project);
        setChangelogs(data.changelogs);
      } catch (error: any) {
        console.error('Error fetching project details:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [params]);

  const goBackToProjects = () => {
    router.push('/public');
  };

  const viewChangelogDetails = (changelogId: string) => {
    router.push(`/public/changelogs/${changelogId}`);
  };

  return (
    <main>
      <Header title="ChangelogAI" subtitle="Project Changelogs" />

      <section className="container" style={{ padding: '40px 0' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>Loading project details...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
            <p>{error}</p>
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={goBackToProjects} 
                style={{ background: '#666' }}
              >
                Back to Projects
              </button>
            </div>
          </div>
        ) : !project ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>Project not found.</p>
            <div style={{ marginTop: '20px' }}>
              <button onClick={goBackToProjects}>
                Back to Projects
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>{project.name}</h2>
                <div>
                  <button 
                    onClick={goBackToProjects} 
                    style={{ background: '#666' }}
                  >
                    Back to Projects
                  </button>
                </div>
              </div>
              
              {project.description && (
                <p style={{ marginTop: '10px' }}>{project.description}</p>
              )}
              
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                <p>Repository: <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                  {project.repositoryUrl}
                </a></p>
              </div>
            </div>

            <div className="changelogs-section">
              <h3>Changelogs</h3>
              
              {changelogs.length > 0 ? (
                <div className="changelogs-list" style={{ marginTop: '20px' }}>
                  {changelogs.map((changelog) => (
                    <div 
                      key={changelog.id}
                      style={{ 
                        marginBottom: '20px', 
                        padding: '20px', 
                        border: '1px solid #eee',
                        borderRadius: '5px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div>
                          <h4 style={{ marginBottom: '5px' }}>{changelog.title}</h4>
                          <div style={{ fontSize: '14px', color: '#666' }}>Version {changelog.version}</div>
                        </div>
                        <div>
                          <button
                            onClick={() => viewChangelogDetails(changelog.id)}
                            style={{ 
                              padding: '8px 12px',
                              background: '#3067cc',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            View changelog
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ marginTop: '20px' }}>No changelogs have been generated for this project yet.</p>
              )}
            </div>
          </>
        )}
      </section>

      <Footer />
    </main>
  );
} 