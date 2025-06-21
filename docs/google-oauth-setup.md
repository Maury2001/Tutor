# Google OAuth Setup Guide for EduGenius AI

## 1. Google Cloud Console Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project: "EduGenius AI Platform"
4. Click "Create"

### Step 2: Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" API

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen first:
   - User Type: External (for testing) or Internal (for organization)
   - App name: "EduGenius AI"
   - User support email: your email
   - Developer contact: your email
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: "EduGenius AI Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)

### Step 4: Get Your Credentials
1. Copy the "Client ID" and "Client Secret"
2. Add them to your environment variables

## 2. Environment Variables Setup

Add these to your `.env.local` file:

\`\`\`env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Generate a secret with: openssl rand -base64 32
\`\`\`

## 3. Production Deployment

For production (Vercel, Netlify, etc.):

1. Set environment variables in your deployment platform
2. Update authorized origins and redirect URIs in Google Console
3. Use your production domain instead of localhost

## 4. Testing the Integration

1. Start your development server: `npm run dev`
2. Go to `/auth/signin`
3. Click "Continue with Google"
4. Complete the OAuth flow
5. You should be redirected back to your app as an authenticated user

## 5. Troubleshooting

### Common Issues:
- **"redirect_uri_mismatch"**: Check your redirect URIs in Google Console
- **"invalid_client"**: Verify your Client ID and Secret
- **"access_blocked"**: Configure OAuth consent screen properly

### Debug Mode:
Set `NEXTAUTH_DEBUG=true` in development to see detailed logs.
\`\`\`

Now let me update the authentication configuration to better handle the OAuth flow:
