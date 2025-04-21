import Link from 'next/link';

export default function PublicChangelogs() {
  return (
    <main>
      <header className="header">
        <div className="container">
          <h1>
            <Link href="/">ChangelogAI</Link> <span>Public Changelogs</span>
          </h1>
        </div>
      </header>

      <section className="container" style={{ padding: '40px 0' }}>
        <h2>All Changelogs</h2>
        <div style={{ marginTop: '20px' }}>
          <p>No changelogs available yet.</p>
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