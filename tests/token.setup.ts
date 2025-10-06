import { test } from "@playwright/test";
import { Auth } from "../app/controllers/Auth";

test("refresh token", async ({ request }) => {
  await new Auth(request).refreshAndSaveToken();
});
