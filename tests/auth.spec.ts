import { test, expect } from "@playwright/test";

const baseUrl = "http://localhost:3000";

test("Basic auth", async ({ page }) => {
  await test.step("should login", async () => {
    await page.goto(`${baseUrl}/api/auth/signin`);
    await page.getByLabel("Email").fill("kubatomiczek@gmail.com");
    await page.getByLabel("Password").fill("12345678!");
    await page
      .getByRole("button", { name: "Sign in with Credentials" })
      .click();

    await page.goto(`${baseUrl}/api/auth/session`);
    expect(await page.locator("html").textContent()).not.toBe("null");
  });

  await test.step("should logout", async () => {
    await page.goto(`${baseUrl}`);
    await page.click("#avatar-menu-trigger");
    await page.getByText("Log out").click();
    await page.waitForLoadState("networkidle");
    await page.goto(`${baseUrl}/api/auth/session`);
    expect(await page.locator("html").textContent()).toBe("null");
  });
});
