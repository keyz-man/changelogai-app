import './globals.css';
import { ReactNode } from 'react';
import { resetStore, createTestData } from './lib/data';

// Reset data store on server start (for development)
resetStore();

// Create test data for development
if (process.env.NODE_ENV === 'development') {
  createTestData();
}

export const metadata = {
  title: 'ChangelogAI - AI-Powered Changelog Generator',
  description: 'Generate beautiful changelogs from your GitHub commits using AI.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 