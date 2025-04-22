# ChangelogAI App

AI-powered changelog generator for your GitHub repositories.

## Database Setup

This project uses SQLite with Prisma ORM for data storage. Here's how it works:

- **Local Database**: SQLite stores all data in a single file (`prisma/dev.db`)
- **Prisma ORM**: Provides a type-safe API for database operations
- **Data Models**: 
  - Projects - stores repository information
  - Commits - tracks commits for each project
  - Changelogs - stores generated changelogs

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Management

The application allows you to:
- Add new projects from GitHub repositories
- View project details and commits
- Generate changelogs (coming soon)
- Delete projects when they're no longer needed

All data is persistently stored in the SQLite database.

## Exploring the Database

To view and edit the database directly:

```bash
npx prisma studio
```

This will open Prisma Studio in your browser at [http://localhost:5555](http://localhost:5555). 