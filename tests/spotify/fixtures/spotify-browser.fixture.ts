import { test as base } from '@playwright/test';

type SpotifyFixtures = {
  spotifyUserToken: string;
};

export const test = base.extend<SpotifyFixtures>({
  spotifyUserToken: async ({ browser, request }, use) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;
    const email = process.env.SPOTIFY_USER_EMAIL!;
    const password = process.env.SPOTIFY_USER_PASSWORD!;

    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();

    // Open login page Spotify
    // https://accounts.spotify.com/en/login?login_hint=yarpansoft%40gmail.com&allow_password=1
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=playlist-modify-private%20playlist-read-private`;
    await page.goto(authUrl);

    // Log in
    await page.fill('input#login-username', email);
    await page.fill('input#login-password', password);
    await page.click('button#login-button');

    // Accept permissions
    try {
      await page.click('button#auth-accept');
    } catch {}

    // Wait for redirect with code
    await page.waitForURL(`${redirectUri}*`);
    const url = page.url();
    const codeMatch = url.match(/[?&]code=([^&]+)/);
    if (!codeMatch) throw new Error('Authorization code not found in redirect URL');

    const authorizationCode = codeMatch[1];
    await context.close();

    // Exchange code for Access Token via Playwright request
    const tokenResponse = await request.post('https://accounts.spotify.com/api/token', {
      form: {
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!tokenResponse.ok()) {
      throw new Error(`Failed to obtain Spotify token: ${tokenResponse.status()} ${await tokenResponse.text()}`);
    }

    const data = await tokenResponse.json();
    await use(data.access_token);
  }
});
