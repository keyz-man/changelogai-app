# ChangelogAI App

AI-powered changelog generator for your GitHub repositories.

## Features

- **Project Management**: Add, view, and manage GitHub repositories
- **Commit Tracking**: View commits from added repositories
- **AI Changelog Generation**: Use Google's Gemini AI to create professional changelogs from commits
- **Public Changelog Sharing**: Share generated changelogs with others

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/keyz-man/changelogai-app.git
cd changelogai-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Google Gemini API (for AI changelog generation):
   - Go to the Google Cloud Console: https://cloud.google.com/
   - Sign in with your Google account
   - click Console link (top right)
   - Click on the "Select a project" button (top left corner). 
   - Click on "New Project" in the window. 
   - Give your project a name and choose an organization (if applicable). 
   - Click "Create".

   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Make sure the model under Plan billing is Gemini 2.0 Flash
   - Click 'Create API key' button (top right)
   - Select the Project you created earlier and create key
   - Create a new API key
   - Create a `.env.local` file in the project root
   - Add your API key: `GOOGLE_AI_API_KEY=your_api_key_here` (look at .env.example for reference)

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

## Database Setup

This project uses SQLite with Prisma ORM for data storage. Here's how it works:

- **Local Database**: SQLite stores all data in a single file (`prisma/dev.db`)
- **Prisma ORM**: Provides a type-safe API for database operations
- **Data Models**: 
  - Projects - stores repository information
  - Commits - tracks commits for each project
  - Changelogs - stores generated changelogs

All data is persistently stored in the SQLite database.

To view and edit the database directly:

```bash
npx prisma studio
```

This will open Prisma Studio in your browser at [http://localhost:5555](http://localhost:5555). 

## Design Choices

**SQLite with Prisma**

SQLite with Prisma in Next.js is a local database solution that works by:
Local File Storage: SQLite stores your entire database in a single file within your project directory

Development Advantages:
- No database server configuration needed
- Works offline
- Zero setup beyond installing packages
- Ideal for development of small application with single machine

**Next.js**

This project leverages Next.js for several key advantages:
- provides both frontend UI and backend API routes in one framework, simplifying development
- the routing system makes it easy to organize pages with nested routes.
- built-in TypeScript support ensures type safety across the entire application.

**Gemini AI**

- Google's Gemini API Free Tier offers a free tier with generous limits
- Well-suited for text summarization tasks like changelog generation
- Other option is local model usage which would require much greater memory to run the app