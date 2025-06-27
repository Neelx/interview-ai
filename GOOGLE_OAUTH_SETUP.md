# Setting Up Google OAuth for Interview AI

This guide will help you set up Google OAuth for the Interview AI application.

## Prerequisites

- A Google account
- Access to the [Google Cloud Console](https://console.cloud.google.com/)

## Steps to Set Up Google OAuth

### 1. Create a New Project in Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click on "New Project"
4. Enter a name for your project (e.g., "Interview AI")
5. Click "Create"

### 2. Configure the OAuth Consent Screen

1. In your new project, go to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required information:
   - App name: "Interview AI"
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"
6. Skip adding scopes by clicking "Save and Continue"
7. Add test users if needed, then click "Save and Continue"
8. Review your settings and click "Back to Dashboard"

### 3. Create OAuth Client ID

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Name: "Interview AI Web Client"
5. Add authorized JavaScript origins:
   - For local development: `http://localhost:5173` (or your Vite development server URL)
   - For production: Add your production URL
6. Add authorized redirect URIs:
   - For local development: `http://localhost:5173` (or your Vite development server URL)
   - For production: Add your production URL
7. Click "Create"

### 4. Get Your Client ID

1. After creating the OAuth client ID, you'll see a modal with your client ID and client secret
2. Copy the client ID

### 5. Configure Your Application

1. Open the `.env` file in your project
2. Replace `YOUR_GOOGLE_CLIENT_ID` with the client ID you copied:
   ```
   VITE_GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
   ```
3. Save the file

## Testing the Integration

1. Start your development server with `npm run dev`
2. Navigate to the sign-in page
3. Click the "Sign in with Google" button
4. You should be redirected to Google's authentication page
5. After authenticating, you should be redirected back to your application and signed in

## Troubleshooting

- If you see a "This app isn't verified" screen, you can proceed by clicking "Advanced" and then "Go to [Your App Name] (unsafe)"
- If you're getting CORS errors, make sure your authorized JavaScript origins are correctly set
- If the redirect isn't working, check that your authorized redirect URIs are correctly set
- For local development, make sure you're using the exact URL of your development server (including the port)