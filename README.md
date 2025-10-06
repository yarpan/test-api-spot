# Spotify API Testing with Playwright

This project uses Playwright to test the Spotify Web API. Below is a step-by-step guide on how to configure authentication and obtain access tokens.

## Prerequisites

1. **Spotify Developer Account**: You need a developer account on [Spotify for Developers](https://developer.spotify.com/)
2. **Node.js**: Node.js version 14 or higher installed
3. **ngrok**: Used to create a public URL for the callback (can be installed via `npm install -g ngrok`)

## Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create app"**
3. Fill out the form:
   - **App name**: Your app name  
   - **App description**: Short app description  
   - **Website**: Can be left blank or set to `localhost`  
   - **Redirect URIs**: `http://localhost:8888/callback` (will be updated later)  
   - **API/SDKs**: Select **"Web API"**
4. Accept the terms and create the app  
5. Save your `Client ID` and `Client Secret` from the app settings

## Step 2: Configure ngrok

1. Install ngrok:

   ```bash
   npm install -g ngrok
   ```

2. Start ngrok on port 8888:

   ```bash
   ngrok http 8888
   ```

3. Copy the HTTPS URL (e.g. `https://abc123.ngrok-free.app`)

4. Update the Redirect URI in your Spotify App:
   - Go back to the Spotify Developer Dashboard  
   - Open your app settings  
   - Replace the Redirect URI with:  
     `https://your-ngrok-url.ngrok-free.app/callback`  
   - Save the changes

## Step 3: Set Environment Variables

1. Create a `.env` file in the root of your project:

   ```env
   # Spotify App credentials
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here

   # Callback URL (your ngrok URL)
   REDIRECT_URL=https://your-ngrok-url.ngrok-free.app/callback

   # Authorization code (will be obtained later)
   AUTHORIZATION_CODE=
   ```

## Step 4: Obtain Authorization Code

### Automatic (using the callback server)

1. Start the callback server:

   ```bash
   npm start
   ```

2. In another terminal, run the helper to generate the auth URL:

   ```bash
   node helper/generateAuthUrl.js
   ```

   Or generate it manually by replacing your own `client_id` and `redirect_uri` in place of the placeholders:

   ```
   https://accounts.spotify.com/en/authorize?response_type=code&client_id=...&scope=playlist-modify-public+user-library-modify+user-library-read+playlist-modify-private+playlist-read-private+user-read-private+user-read-email&redirect_uri=...
   ```

3. Copy the generated URL and open it in your browser  
4. Log into your Spotify account and grant permissions  
5. After the redirect, the authorization code will appear on the page  
6. Copy that code and paste it into your `.env` file as `AUTHORIZATION_CODE`

## Step 5: Obtain Access Token

1. Make sure the `AUTHORIZATION_CODE` is added to your `.env` file  
2. Run the helper to retrieve tokens:

   ```bash
   node helper/authHelper.mjs
   ```

3. This script will:
   - Send a POST request to the Spotify Token API  
   - Receive the `access_token`, `refresh_token`, and other data  
   - Save tokens to the `tokens.json` file

## Step 6: Run Tests

Now you can run Spotify API tests:

```bash
# Run all Spotify tests
npx playwright test

# Run a specific test
npx playwright test tests/playlist.spec.ts

# Run tests with an HTML report
npx playwright test --reporter=html
```
