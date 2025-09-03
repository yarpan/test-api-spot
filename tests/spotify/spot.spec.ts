import { test } from "./fixtures/token.fixture";
import { expect } from "@playwright/test";

test("Spotify album request", async ({ request, token }) => {

  const response = await request.get("/tracks/2TpxZ7JUBn3uw46aR7qd6V",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("Response status:", response.status());
console.log("Response body:", await response.text());

  expect(response.ok()).toBe(true);

  const data = await response.json();
  expect(data).toHaveProperty("name");
});

test("get playlist, should be valid", async ({ request, token }) => {
    const response = await request.get(
        "/v1/playlists/3cEYpjA9oz9GiPac4AsH4n",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    expect(response.status()).toBe(200);
    const json = await response.json();
});

test("create playlist, should be valid", async ({ request, token }) => {
    const response = await request.post(
        "/v1/users/dad86b5064364416a87335b4a520c9b1/playlists",
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":"application/json"
            },
            data: {
    "name": "New Playlist",
    "description": "New playlist description",
    "public": false
}
        }
    );

    expect(response.status()).toBe(201);
    const json = await response.json();
    console.log(json);
});