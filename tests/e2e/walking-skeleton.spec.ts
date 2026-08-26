import { test, expect } from "@playwright/test";

test("walking skeleton: start -> set -> refresh -> resume -> finish", async ({
  page,
}) => {
  await page.goto("/");
  const start = page.getByRole("button", { name: "Start workout" });
  if (await start.isVisible()) await start.click();
  await expect(
    page.getByRole("heading", { name: "Barbell Bench Press" }),
  ).toBeVisible();
  const complete = page.getByRole("button", { name: "Complete set" });
  if (await complete.isVisible()) await complete.click();
  await expect(page.getByText(/Recorded:/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Recorded:/)).toBeVisible();
  await page.getByRole("button", { name: "Finish workout" }).click();
  await expect(
    page.getByRole("heading", { name: "Completed result" }),
  ).toBeVisible();
});
