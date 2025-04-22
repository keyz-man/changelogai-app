import Link from 'next/link';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="header">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ textAlign: 'left', margin: 0 }}>
            <Link href="/">{title}</Link>
          </h1>
        </div>
        
        {subtitle && (
          <div style={{ flex: 2, textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#666', margin: 0 }}>{subtitle}</h2>
          </div>
        )}
        
        <div style={{ flex: 1 }}></div>
      </div>
    </header>
  );
} 