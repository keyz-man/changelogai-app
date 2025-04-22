# ChangelogAI App

AI-powered changelog generator for your GitHub repositories.

## Features

- **Project Management**: Add, view, and manage GitHub repositories
- **Commit Tracking**: View commits from added repositories
- **AI Changelog Generation**: Use Google's Gemini AI to create professional changelogs
- **Public Changelog Sharing**: Share generated changelogs with others

## Database Setup

This project uses SQLite with Prisma ORM for data storage. Here's how it works:

- **Local Database**: SQLite stores all data in a single file (`prisma/dev.db`)
- **Prisma ORM**: Provides a type-safe API for database operations
- **Data Models**: 
  - Projects - stores repository information
  - Commits - tracks commits for each project
  - Changelogs - stores generated changelogs

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/changelogai-app.git
cd changelogai-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Google Gemini API (for AI changelog generation):
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Create a `.env.local` file in the project root
   - Add your API key: `GOOGLE_AI_API_KEY=your_api_key_here`

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Using AI Changelog Generation

The application uses Google's Gemini AI to generate professional changelogs from your commit messages:

1. Add a project from a GitHub repository
2. Navigate to the project details page
3. Select commits and date range
4. Generate an AI-powered changelog with a single click

If the Google AI API key is not configured:
- You will see a clear error message when trying to generate an AI changelog
- You can still create basic changelogs without AI by unchecking the "Use AI" option

## Data Management

The application allows you to:
- Add new projects from GitHub repositories
- View project details and commits
- Generate changelogs with AI assistance
- Delete projects when they're no longer needed

All data is persistently stored in the SQLite database.

## Exploring the Database

To view and edit the database directly:

```bash
npx prisma studio
```

This will open Prisma Studio in your browser at [http://localhost:5555](http://localhost:5555). 