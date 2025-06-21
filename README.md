# CBC Tutorbot Platform

A comprehensive learning platform for the Kenya CBC curriculum with AI-powered tutoring.

## Auto-Configuration

This project includes an auto-configuration system that automatically detects and sets up all necessary environment variables and settings.

### Quick Start

1. Clone the repository
2. Run the auto-configuration script:

\`\`\`bash
npm run auto-config
\`\`\`

3. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

4. Visit [http://localhost:3000/admin/config](http://localhost:3000/admin/config) to view your system configuration

### Environment Variables

The auto-configuration system will generate a `.env` file with sensible defaults for development. For production, you'll need to set the following environment variables:

- `NEXTAUTH_SECRET`: A secure secret for NextAuth.js
- `OPENAI_API_KEY`: Your OpenAI API key
- `DATABASE_URL`: Your PostgreSQL database URL

See `.env.example` for all available configuration options.

## Features

- Auto-detection of environment (development, production, preview)
- Auto-configuration of NextAuth.js
- Auto-detection of database connections
- Auto-configuration of AI providers
- Configuration dashboard for system monitoring
- Secure secret generation for development

## Configuration Dashboard

Visit `/admin/config` to view the current system configuration. This dashboard shows:

- Environment status
- Database connection
- Authentication providers
- AI model configuration
- Deployment settings

## API

The auto-configuration system exposes a safe subset of configuration values via the `/api/auto-config` endpoint.

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application
- `npm run start`: Start the production server
- `npm run auto-config`: Auto-generate environment variables
