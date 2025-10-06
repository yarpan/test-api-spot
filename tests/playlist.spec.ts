import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";

test("create playlist", async ({ request, tokens }) => {
  const { access_token } = tokens;
  const userIdResponse = await request.get("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const userId = (await userIdResponse.json()).id;

  const playlistName = `Test Playlist ${Date.now()}`;
  const playlistResponse = await request.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      data: {
        name: playlistName,
        description: "A test playlist created by Playwright",
        public: false,
      },
    }
  );

  expect(playlistResponse.status()).toBe(201);
});

test("get playlist by id, should be returned", async ({ request, tokens }) => {
  const response = await request.get(
    `https://api.spotify.com/v1/playlists/64T4UTmzbZwRayO7wOTc9q`,
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    }
  );

  expect(response.status()).toBe(200);
});

test("[NEW ]get playlist by id, should be returned", async ({ client }) => {
  const response = await client.playlist.getPlaylistById(
    "64T4UTmzbZwRayO7wOTc9q"
  );

  expect(response.status()).toBe(200);
});

test("[NEW] create playlist by id, should be created", async ({ client }) => {
  const userIdResponse = await client.users.getCurrentUsersProfile();
  const userId = (await userIdResponse.json()).id;

  const response = await client.playlist.createPlaylist(userId, {
    name: "any name",
    description: "some descrip",
    public: false,
  });

  expect(response.status()).toBe(201);
});

test.skip("poll until it return value", async ({ client }) => {
  const userIdResponse = await client.users.getCurrentUsersProfile();
  const userId = (await userIdResponse.json()).id;

  expect
    .poll(
      async () => {
        const response = await client.playlist.createPlaylist(userId, {
          name: "any name",
          description: "some descrip",
          public: false,
        });

        return response.ok();
      },
      {
        timeout: 3 * 60 * 60 * 1000,
        intervals: [60_000, 60_000, 180_000],
      }
    )
    .toBeTruthy();
});
