// fixtures/spotifyToken.ts
import { test as base } from '@playwright/test';

type SpotifyFixtures = {
  spotifyAccessToken: string;
};

export const test = base.extend<SpotifyFixtures>({
  spotifyAccessToken: async ({ request }, use) => {
    // ❗ ці значення потрібно взяти зі Spotify Developer Dashboard
    const client_id = process.env.SPOTIFY_CLIENT_ID!;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;
    const authorization_code = process.env.SPOTIFY_AUTH_CODE!;

    const tokenResponse = await request.post(
      'https://accounts.spotify.com/api/token',
      {
        form: {
          grant_type: 'authorization_code',
          code: authorization_code,
          redirect_uri,
          client_id,
          client_secret
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (tokenResponse.status() !== 200) {
      throw new Error(
        `Failed to get Spotify token: ${tokenResponse.status()} ${await tokenResponse.text()}`
      );
    }

    const tokenData = await tokenResponse.json();
    await use(tokenData.access_token);
  }
});
