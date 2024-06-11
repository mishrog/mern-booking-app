import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/"; // this is base url where the testing starts from

test("should allow the user to sign in", async ({ page }) => {
  // page gets passed on to our test by playwright framework
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click(); // once we click the sign in link, we want to assert that we have been redirected to sign in page

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible(); // WE ARE EXPECTING A HEADING OF SIGN IN : Visible asserion

  await page.locator("[name=email]").fill("1@1.com"); // find an element on page that has name email -> fill it with this text
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("Sign In Succesful!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("should allow user to register", async ({ page }) => {
  const testEmail = `test-register_${Math.floor(Math.random() * 900000) + 10000}@test.com`
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword]").fill("password123");

  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("Registration Success!")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
