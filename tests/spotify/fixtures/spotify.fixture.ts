import { test as base, APIRequestContext, request as playwrightRequest } from "@playwright/test";

type MyFixtures = {
  spotifyRequest: APIRequestContext;
};

const baseUrl = "https://api.spotify.com/v1";
const authUrl = "https://accounts.spotify.com/api";


export const test = base.extend<MyFixtures>({
  spotifyRequest: async ({ }, use) => {

    if (!isTokenValid()) {
      const newTokenData = await obtainNewSpotifyToken();
      process.env.SPOTIFY_TOKEN = newTokenData.token;
      process.env.SPOTIFY_TOKEN_EXPIRATION = newTokenData.expiresAt.toString();
    }

    const token = process.env.SPOTIFY_TOKEN!;
    console.log(`Using Spotify token: ${token}`);

    const authRequest = await playwrightRequest.newContext({
      baseURL: baseUrl,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    await use(authRequest);
    await authRequest.dispose();
  },
});


/**
 * Check if token valid
 */
function isTokenValid(): boolean {
  const token = process.env.SPOTIFY_TOKEN;
  const expStr = process.env.SPOTIFY_TOKEN_EXPIRATION;
  if (!token || !expStr) return false;
  return Date.now() < parseInt(expStr, 10);
}


/**
 * Obtains new token and stores it in process.env along with the expiration time
 */
async function obtainNewSpotifyToken() {
  const context = await playwrightRequest.newContext();
console.log(`SPOTIFY_CLIENT_ID: ${process.env.SPOTIFY_CLIENT_ID}\n SPOTIFY_CLIENT_SECRET: ${process.env.SPOTIFY_CLIENT_SECRET}`);

  const response = await context.post("https://accounts.spotify.com/api/token?grant_type=client_credentials", {
    //form: { grant_type: "client_credentials" },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
  });

  if (!response.ok()) throw new Error(`Failed to obtain new token`);
  const data = await response.json();
  console.log(`Obtained new token: ${data}`);
  await context.dispose();

  const expiresAt = Date.now() + data.expires_in * 1000;
  return { token: data.access_token, expiresAt };
}
