import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <header className="header">
        <div className="container">
          <h1>ChangelogAI</h1>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h2>AI-Powered Changelog Generator</h2>
          <p>Generate beautiful changelogs from your GitHub commits in seconds</p>
          
          <div className="hero-buttons">
            <Link href="/developer">
              <button>Developer Dashboard</button>
            </Link>
            <Link href="/public">
              <button>View Changelogs</button>
            </Link>
          </div>
          
          <div className="steps">
            <div className="step">
              <h3>Step 1</h3>
              <p>Link your GitHub repository</p>
            </div>
            <div className="step">
              <h3>Step 2</h3>
              <p>Select commit date range</p>
            </div>
            <div className="step">
              <h3>Step 3</h3>
              <p>Generate and publish your changelog</p>
            </div>
          </div>
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