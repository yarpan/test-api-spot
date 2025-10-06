import { test as base, expect, request } from "@playwright/test";
import fs from "fs";
import path from "path";
import { APIClient } from "../apps/APIClient";
import { Auth } from "../apps/controllers/Auth";
import { SpotifyTokenResponse, TokenHelper } from "./TokenHelper";

type Fixtures = {
  tokens: SpotifyTokenResponse;
  client: APIClient;
};

export const test = base.extend<Fixtures>({
  tokens: async ({}, use) => {
    const apiContext = await request.newContext();

    let tokens = await TokenHelper.getTokens();
    tokens = await TokenHelper.refreshTokenIfNeeded(tokens, apiContext);
    await use(tokens);
  },

  request: async ({ tokens }, use) => {
    const newContext = await request.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${tokens.access_token}`,
        "Content-Type": "application/json",
      },
    });

    await use(newContext);
  },

  client: async ({ request }, use) => {
    const client = new APIClient(request);
    await use(client);
  },
});

export { expect };
