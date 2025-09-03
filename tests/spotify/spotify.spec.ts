import { test } from "./fixtures/spotify.fixture";
import { expect } from "@playwright/test";

test("Spotify album request", async ({ request }) => {
  const response = await request.get("/tracks/2TpxZ7JUBn3uw46aR7qd6V");

  console.log("Response status:", response.status());
console.log("Response body:", await response.text());

  expect(response.ok()).toBe(true);

  const data = await response.json();
  expect(data).toHaveProperty("name");
});