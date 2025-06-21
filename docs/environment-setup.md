# Environment Setup Guide

This guide will help you configure all required environment variables for the CBC Tutorbot Platform.

## Quick Start

### Option 1: Interactive Setup (Recommended)
\`\`\`bash
npm run setup:env
\`\`\`
This will guide you through setting up all environment variables interactively.

### Option 2: Quick Presets
\`\`\`bash
# For local development
npm run setup:quick development

# For production deployment
npm run setup:quick production

# For testing
npm run setup:quick testing
\`\`\`

### Option 3: Manual Setup
Copy `.env.example` to `.env` and fill in your values:
\`\`\`bash
cp .env.example .env
\`\`\`

## Validation

After setup, validate your configuration:
\`\`\`bash
npm run validate:env
\`\`\`

## Complete Setup
Run both setup and validation:
\`\`\`bash
npm run setup:complete
\`\`\`

## Required Environment Variables

### Authentication
- `NEXTAUTH_SECRET` - Secret key for session encryption (auto-generated)
- `NEXTAUTH_URL` - Your application URL (e.g., http://localhost:3000)

### Database
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key

### AI Services
- `OPENAI_API_KEY` - OpenAI API key (required for AI features)

## Optional Environment Variables

### AI Services
- `GROQ_API_KEY` - Groq API key for alternative AI models

### OAuth Providers
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret

### Integrations
- `KV_URL` - Redis/Upstash KV database URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

## Service Setup Instructions

### Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (2-3 minutes)
3. Go to Settings → API to find your URL and keys
4. Copy the Project URL to `SUPABASE_URL`
5. Copy the anon/public key to `SUPABASE_ANON_KEY`
6. Go to Settings → Database to find the connection string
7. Copy the connection string to `DATABASE_URL`

### OpenAI API Setup
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with sk-proj-...)
6. Add it as `OPENAI_API_KEY`
7. Make sure you have billing set up for API usage

### Google OAuth Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to APIs & Services → Credentials
5. Create OAuth 2.0 Client ID
6. Add your domain to authorized origins
7. Add callback URL: `https://yourdomain.com/api/auth/callback/google`
8. Copy Client ID and Secret

## Troubleshooting

### Common Issues

**AI Assistant Not Responding**
- Check `OPENAI_API_KEY` is set correctly
- Verify OpenAI account has sufficient credits
- Check browser console for error messages

**Database Connection Issues**
- Verify `DATABASE_URL` format is correct
- Check Supabase project is active and running
- Ensure database has proper tables (run setup scripts)

**Authentication Problems**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure OAuth providers are configured correctly

### Getting Help

1. Run the validation script: `npm run validate:env`
2. Check the configuration verification page: `/config-verification`
3. Review the browser console for detailed error messages
4. Check the server logs for API errors

## Security Notes

- Never commit `.env` files to version control
- Use different secrets for different environments
- Rotate API keys regularly
- Use service role keys only when necessary
- Keep backup of working configurations

## Scripts Reference

- `npm run setup:env` - Interactive environment setup
- `npm run setup:quick <preset>` - Quick setup with presets
- `npm run validate:env` - Validate current configuration
- `npm run setup:complete` - Complete setup and validation
