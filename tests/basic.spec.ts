import { test, expect } from "@playwright/test";

const baseUrl = "http://localhost:3000";

test("Basic use", async ({ page }) => {
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

  await test.step("should add new project", async () => {
    await page.goto(`${baseUrl}/projects`);
    await page.getByRole("button", { name: "Utwórz projekt" }).click();
    await page
      .getByPlaceholder("Nazwa nowego projektu")
      .fill("Projekt testowy");
    await page.getByRole("button", { name: "Zapisz" }).click();
    await expect(page.getByText("Projekt testowy")).toBeVisible();
  });

  await test.step("should active project with name projekt testowy", async () => {
    await page.goto(`${baseUrl}/projects`);
    await page.getByRole("button", { name: "Ustaw jako aktywny" }).click();

    const aktywnyButton = page.getByRole("button", { name: "Aktywny" });
    await expect(aktywnyButton).toBeVisible();
    await expect(aktywnyButton).toBeDisabled();
  });

  await test.step("should add story", async () => {
    await page.goto(`${baseUrl}/stories`);
    await page.getByRole("button", { name: "Dodaj historię" }).click();
    await page.getByPlaceholder("Tytuł").fill("Historyjka testowa");
    await page.getByRole("button", { name: "Zapisz" }).click();
    await expect(page.getByText("Historyjka testowa")).toBeVisible();
  });

  await test.step("should add task", async () => {
    await page.goto(`${baseUrl}/tasks`);
    await page.getByRole("button", { name: "Dodaj zadanie" }).click();
    await page.getByPlaceholder("Nazwa zadania").fill("Zadanie testowe");
    await page.getByRole("combobox").filter({ hasText: "Historyjka" }).click();

    await page.getByText("Historyjka testowa").click();
    await page.getByRole("button", { name: "Zapisz" }).click();
    await expect(page.getByText("Zadanie testowe")).toBeVisible();
  });

  await test.step("should change task status", async () => {
    await page.getByText("Zadanie testowe", { exact: true }).click();
    await page
      .getByRole("combobox")
      .filter({ hasText: "Wybierz osobę" })
      .click();
    await page.getByText("Jakub Tomiczek").click();
    await expect(page.getByText("W trakcie")).toBeVisible();
  });

  await test.step("should delete task", async () => {
    await page.getByRole("button", { name: "Usuń" }).click();
    await expect(page.getByText("Zadanie testowe")).not.toBeVisible();
  });

  await test.step("should delete story", async () => {
    await page.goto(`${baseUrl}/stories`);
    await page.getByRole("button", { name: "Usuń" }).click();
    await expect(page.getByText("Historyjka testowa")).not.toBeVisible();
  });

  await test.step("should delete project", async () => {
    await page.goto(`${baseUrl}/projects`);
    await page.getByRole("button", { name: "Usuń" }).click();
    await expect(page.getByText("Projekt testowy")).not.toBeVisible();
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
