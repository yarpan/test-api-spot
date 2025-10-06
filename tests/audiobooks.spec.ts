import { expect } from "playwright/test";
import { test } from "../fixtures/fixtures";

test("GET audiobook by id, should return it", async ({ request, tokens }) => {
  const response = await request.get(
    "https://api.spotify.com/v1/audiobooks/4avr1xg40CUAMy20prkssU",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    }
  );

  expect(response.status()).toBe(200);
});
