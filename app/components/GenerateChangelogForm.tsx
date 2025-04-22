'use client';

import { useState, useEffect } from 'react';
import { Project, Commit } from '@/app/lib/types';

type DateRange = {
  fromDate: string;
  toDate: string;
};

type Props = {
  project: Project;
  onChangelogGenerated: () => void;
};

export default function GenerateChangelogForm({ project, onChangelogGenerated }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState(`${project.name} Update`);
  const [version, setVersion] = useState('1.0.0');
  const [dateRange, setDateRange] = useState<DateRange>({
    fromDate: '',
    toDate: ''
  });
  const [selectedCommits, setSelectedCommits] = useState<Commit[]>([]);
  const [error, setError] = useState('');
  const [aiError, setAiError] = useState('');
  const [isUsingAI, setIsUsingAI] = useState(true);

  // Initialize date range and filtered commits once when component mounts or project changes
  useEffect(() => {
    if (project.commits.length > 0) {
      // Sort commits by date (newest first)
      const sortedCommits = [...project.commits].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Default to last 7 days or all commits if timespan is less
      const newestDate = new Date(sortedCommits[0].date);
      const oldestDate = new Date(sortedCommits[sortedCommits.length - 1].date);
      
      let fromDate = new Date(newestDate);
      fromDate.setDate(newestDate.getDate() - 7);
      
      // If fromDate would be before oldest commit, just use oldest commit date
      if (fromDate < oldestDate) {
        fromDate = oldestDate;
      }
      
      const fromDateString = fromDate.toISOString().split('T')[0];
      const toDateString = newestDate.toISOString().split('T')[0];
      
      // Update the date range
      setDateRange({
        fromDate: fromDateString,
        toDate: toDateString
      });
      
      // Filter commits based on this initial date range
      const fromTimestamp = fromDate.getTime();
      const toTimestamp = new Date(toDateString + 'T23:59:59').getTime();
      
      const initialFilteredCommits = sortedCommits.filter(commit => {
        const commitTimestamp = new Date(commit.date).getTime();
        return commitTimestamp >= fromTimestamp && commitTimestamp <= toTimestamp;
      });
      
      setSelectedCommits(initialFilteredCommits);
    }
  }, [project.commits]);

  // Handle date change and filter commits
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDateRange = {
      ...dateRange,
      [name]: value
    };
    
    setDateRange(newDateRange);
    
    // Re-filter commits when date range changes
    if (newDateRange.fromDate && newDateRange.toDate) {
      const fromTimestamp = new Date(newDateRange.fromDate).getTime();
      const toTimestamp = new Date(newDateRange.toDate + 'T23:59:59').getTime();
      
      // Sort commits by date (newest first)
      const sortedCommits = [...project.commits].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const filtered = sortedCommits.filter(commit => {
        const commitTimestamp = new Date(commit.date).getTime();
        return commitTimestamp >= fromTimestamp && commitTimestamp <= toTimestamp;
      });
      
      setSelectedCommits(filtered);
    }
  };

  const handleGenerateChangelog = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCommits.length === 0) {
      setError('No commits found in the selected date range');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    setAiError('');
    
    try {
      if (isUsingAI) {
        // Generate changelog using AI
        const aiResponse = await fetch('/api/changelogs/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: project.id,
            commitIds: selectedCommits.map(commit => commit.id),
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
          }),
        });
        
        const aiData = await aiResponse.json();
        
        if (!aiResponse.ok) {
          // Handle specific API key errors
          if (aiData.error && aiData.error.includes('API key not configured')) {
            setAiError(aiData.details || 'Missing Google AI API key. Please configure it in your .env.local file.');
            throw new Error('API key configuration required');
          }
          
          throw new Error(aiData.error || 'Failed to generate AI changelog');
        }
        
        // Use the AI-generated title and content
        const generatedTitle = aiData.generated.title;
        const generatedContent = aiData.generated.content;
        
        // Create changelog with the AI-generated content
        const response = await fetch('/api/changelogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: project.id,
            title: generatedTitle || title,
            version: version,
            content: generatedContent,
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
          }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to save changelog');
        }
      } else {
        // Manual changelog generation (fallback if AI is disabled)
        const content = selectedCommits.map(commit => 
          `- ${commit.message} (${commit.author}, ${new Date(commit.date).toLocaleDateString()})`
        ).join('\n');
        
        const response = await fetch('/api/changelogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: project.id,
            title: title,
            version: version,
            content: content,
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
          }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to generate changelog');
        }
      }
      
      // Success! Close the modal or refresh the list
      onChangelogGenerated();
    } catch (error: any) {
      if (error.message !== 'API key configuration required') {
        setError(error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="generate-changelog-form">
      <h3>Generate Changelog</h3>
      
      <form onSubmit={handleGenerateChangelog}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
          {isUsingAI && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Note: AI will generate a title based on the commits
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="version" style={{ display: 'block', marginBottom: '5px' }}>
            Version
          </label>
          <input
            type="text"
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="fromDate" style={{ display: 'block', marginBottom: '5px' }}>
              From Date
            </label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={dateRange.fromDate}
              onChange={handleDateChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="toDate" style={{ display: 'block', marginBottom: '5px' }}>
              To Date
            </label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={dateRange.toDate}
              onChange={handleDateChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0 }}>Selected Commits ({selectedCommits.length})</h4>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="useAI" style={{ marginRight: '8px', fontSize: '14px' }}>
                Use AI
              </label>
              <input
                type="checkbox"
                id="useAI"
                checked={isUsingAI}
                onChange={(e) => setIsUsingAI(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
            </div>
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px' }}>
            {selectedCommits.length > 0 ? (
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {selectedCommits.map(commit => (
                  <li key={commit.id} style={{ padding: '5px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <div style={{ fontWeight: 'bold' }}>{commit.message}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {commit.author} - {new Date(commit.date).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No commits found in the selected date range</p>
            )}
          </div>
        </div>
        
        {aiError && (
          <div style={{ padding: '15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
            <strong>AI Generation Error:</strong> {aiError}
            <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
              You can still generate a basic changelog without AI by unchecking the "Use AI" option.
            </p>
          </div>
        )}
        
        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={isGenerating || selectedCommits.length === 0}
            style={{ 
              width: '100%',
              padding: '10px',
              background: selectedCommits.length === 0 ? '#ccc' : 'var(--primary-purple)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedCommits.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {isGenerating ? 'Generating...' : isUsingAI ? 'Generate AI Changelog' : 'Generate Basic Changelog'}
          </button>
        </div>
      </form>
    </div>
  );
} 