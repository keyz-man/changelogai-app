import Link from 'next/link';

export default function DeveloperDashboard() {
  return (
    <main>
      <header className="header">
        <div className="container">
          <h1>
            <Link href="/">ChangelogAI</Link> <span>Developer Dashboard</span>
          </h1>
        </div>
      </header>

      <section className="container" style={{ padding: '40px 0' }}>
        <h2>Your Projects</h2>
        <div style={{ marginTop: '20px' }}>
          <p>No projects yet. Create one by linking a GitHub repository.</p>
          <button style={{ marginTop: '20px' }}>Add New Project</button>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} ChangelogAI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
} 