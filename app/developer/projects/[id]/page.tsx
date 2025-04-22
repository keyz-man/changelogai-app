'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import GenerateChangelogForm from '@/app/components/GenerateChangelogForm';
import { Project, Commit, Changelog } from '@/app/lib/types';

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('commits'); // 'commits' or 'changelogs'
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isGenerateFormVisible, setIsGenerateFormVisible] = useState(false);

  // Force a refresh
  const refreshProject = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setIsLoading(true);
      setError('');
      
      // Get the project ID from params
      // params.id can be a string or string[] depending on the route
      const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
      
      if (!projectId) {
        setError('Project ID is missing');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching project with ID:', projectId);
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
  }, [params, refreshTrigger]);

  const toggleGenerateForm = () => {
    // When switching to changelogs tab, hide the form
    if (activeTab === 'changelogs') {
      setIsGenerateFormVisible(false);
    } else {
      setIsGenerateFormVisible(!isGenerateFormVisible);
    }
  };

  const handleChangelogGenerated = () => {
    toggleGenerateForm();
    refreshProject();
  };

  // When changing tabs, hide the generate form
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'changelogs') {
      setIsGenerateFormVisible(false);
    }
  };

  const goBackToProjects = () => {
    router.push('/developer');
  };

  const viewChangelogDetails = (changelogId: string) => {
    router.push(`/developer/changelogs/${changelogId}`);
  };

  return (
    <main>
      <Header title="ChangelogAI" subtitle="Project Details" />

      <section className="container" style={{ padding: '40px 0' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>Loading project details...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
            <p>{error}</p>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button 
                onClick={refreshProject} 
                style={{ marginTop: '20px' }}
              >
                Retry
              </button>
              <button 
                onClick={goBackToProjects} 
                style={{ background: '#666', marginTop: '20px' }}
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
                    onClick={refreshProject} 
                    style={{ marginRight: '10px', background: '#666' }}
                  >
                    Refresh
                  </button>
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
                <p>
                  Repository: <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    {project.repositoryUrl}
                  </a>
                </p>
                <p>Added: {new Date(project.createdAt).toLocaleDateString()}</p>
                <p>{project.commits.length} commits</p>
              </div>
            </div>

            <div className="tabs" style={{ marginBottom: '20px' }}>
              <button
                onClick={() => handleTabChange('commits')}
                style={{ 
                  padding: '10px 20px', 
                  marginRight: '10px',
                  background: activeTab === 'commits' ? 'var(--primary-purple)' : '#e0e0e0',
                  color: activeTab === 'commits' ? 'white' : '#333'
                }}
              >
                Commits
              </button>
              <button
                onClick={() => handleTabChange('changelogs')}
                style={{ 
                  padding: '10px 20px',
                  background: activeTab === 'changelogs' ? 'var(--primary-purple)' : '#e0e0e0',
                  color: activeTab === 'changelogs' ? 'white' : '#333'
                }}
              >
                Changelogs
              </button>
            </div>

            {isGenerateFormVisible && (
              <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                <GenerateChangelogForm 
                  project={project} 
                  onChangelogGenerated={handleChangelogGenerated} 
                />
              </div>
            )}

            {activeTab === 'commits' ? (
              <div className="commits-tab">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3>Commits</h3>
                  <button onClick={toggleGenerateForm}>
                    {isGenerateFormVisible ? 'Cancel Generation' : 'Generate Changelog'}
                  </button>
                </div>
                
                <div className="commits-list">
                  {project.commits.length > 0 ? (
                    project.commits.map((commit: Commit) => (
                      <div 
                        key={commit.id}
                        style={{ 
                          marginBottom: '15px', 
                          padding: '15px', 
                          border: '1px solid #eee',
                          borderRadius: '5px'
                        }}
                      >
                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{commit.message}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                          <span>By: {commit.author}</span>
                          <span>{new Date(commit.date).toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                          <code>{commit.id.substring(0, 7)}</code>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No commits available for this repository.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="changelogs-tab">
                <div style={{ marginBottom: '20px' }}>
                  <h3>Changelogs</h3>
                </div>
                
                {changelogs.length > 0 ? (
                  <div className="changelogs-list">
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
                              Learn more
                            </button>
                          </div>
                        </div>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                          Generated on {new Date(changelog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No changelogs have been generated yet. Create your first changelog by selecting commits from the Commits tab.</p>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </main>
  );
} 