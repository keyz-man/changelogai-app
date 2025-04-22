import './globals.css';
import { ReactNode } from 'react';
import { resetStore } from './lib/data';

// Reset data store on server start (for development)
resetStore();

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