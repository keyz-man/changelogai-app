import Link from 'next/link';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="header">
      <div className="container">
        <h1>
          <Link href="/">{title}</Link>
          {subtitle && <span style={{ color: '#666', marginLeft: '10px', fontSize: '0.8em' }}>{subtitle}</span>}
        </h1>
      </div>
    </header>
  );
} 