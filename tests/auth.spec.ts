import { expect } from "@playwright/test";
import { test } from "../fixtures/fixtures";
// import { generateAuthUrl } from "../helper/generateAuthUrl";

test("get token, should be valid", async ({ request }) => {
  const response = await request.post(
    "https://accounts.spotify.com/api/token",
    {
      form: {
        grant_type: "client_credentials",
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            [process.env.SPOTIFY_CLIENT_ID] +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
    }
  );

  expect(response.status()).toBe(200);

  const token = (await response.json()).access_token;

  expect(token).toBeDefined();
});

// not working because Spotify will suspend account very quickly
test.skip("get auth", async ({ page }) => {
  await page.goto(
    `https://accounts.spotify.com/en/login?login_hint=${process.env.EMAIL}&allow_password=1`
  );

  await page.getByTestId("login-username").fill(process.env.EMAIL!);
  await page.getByTestId("login-button").click();
  await page.getByRole("button", { name: "Log in with a password" }).click();
  await page.getByRole("button", { name: "Log in with a password" }).click();

  await page.getByTestId("login-password").fill(process.env.PASSWORD!);
  await page.getByTestId("login-button").click({ delay: 1000 });
  // const url = generateAuthUrl();

  // const response = await page.goto(url);
  // const token = await page.locator("").textContent();
});
