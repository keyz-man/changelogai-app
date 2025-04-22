'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { Changelog } from '@/app/lib/types';

export default function PublicChangelogDetail() {
  const params = useParams();
  const router = useRouter();
  const [changelog, setChangelog] = useState<Changelog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChangelogDetails = async () => {
      setIsLoading(true);
      setError('');
      
      // Get the changelog ID from params
      const changelogId = Array.isArray(params.id) ? params.id[0] : params.id;
      
      if (!changelogId) {
        setError('Changelog ID is missing');
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/changelogs/${changelogId}`);
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch changelog');
        }
        
        setChangelog(data.changelog);
      } catch (error: any) {
        console.error('Error fetching changelog:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChangelogDetails();
  }, [params]);

  const goBack = () => {
    if (changelog) {
      router.push(`/public/projects/${changelog.projectId}`);
    } else {
      router.push('/public');
    }
  };

  return (
    <main>
      <Header title="ChangelogAI" subtitle="Changelog Details" />

      <section className="container" style={{ padding: '40px 0' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>Loading changelog...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
            <p>{error}</p>
            <button onClick={goBack} style={{ marginTop: '20px' }}>
              Go Back
            </button>
          </div>
        ) : !changelog ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <p>Changelog not found.</p>
            <button onClick={goBack} style={{ marginTop: '20px' }}>
              Go Back
            </button>
          </div>
        ) : (
          <div className="changelog-detail" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '30px' }}>
              <h1 style={{ marginBottom: '10px', fontSize: '32px' }}>{changelog.title}</h1>
              <div style={{ marginBottom: '20px', fontSize: '18px', color: '#666' }}>
                Version {changelog.version}
              </div>
              <button
                onClick={goBack}
                style={{ 
                  padding: '8px 15px',
                  background: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: '20px'
                }}
              >
                Back to Project
              </button>
            </div>
            
            <div 
              className="changelog-content" 
              style={{ 
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                backgroundColor: '#f9f9f9',
                padding: '20px',
                borderRadius: '5px',
                border: '1px solid #eee'
              }}
            >
              {changelog.content}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
} 