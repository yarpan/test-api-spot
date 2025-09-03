import { expect, test } from "@playwright/test";

test.describe("Spotify API", () => {

    test.beforeAll(async ({ request }) => {
        const response = await request.post("https://accounts.spotify.com/api/token",
            {
                form: {
                    grant_type: "client_credentials",
                },
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            process.env.SPOTIFY_CLIENT_ID +
                            ":" +
                            process.env.SPOTIFY_CLIENT_SECRET
                        ).toString("base64"),
                },
            }
        );

        console.log(`SPOTIFY_CLIENT_ID: ${process.env.SPOTIFY_CLIENT_ID}\nSPOTIFY_CLIENT_SECRET: ${process.env.SPOTIFY_CLIENT_SECRET}`);

        expect(response.status()).toBe(200);
        const token = (await response.json()).access_token;
        expect(token).toBeDefined();

        console.log(`SPOTIFY_TOKEN: ${token}`);

    });


    test("Spotify album request", async ({ request }) => {

        const response = await request.get("/tracks/2TpxZ7JUBn3uw46aR7qd6V");

  console.log("Response status:", response.status());
console.log("Response body:", await response.text());


});


});