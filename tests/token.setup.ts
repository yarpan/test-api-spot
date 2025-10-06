import { test } from "@playwright/test";
import { Auth } from "../apps/controllers/Auth";

test("refresh token", async ({ request }) => {
  await new Auth(request).refreshAndSaveToken();
});
