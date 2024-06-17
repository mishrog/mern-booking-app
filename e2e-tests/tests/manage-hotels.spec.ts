import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  // page gets passed on to our test by playwright framework
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click(); // once we click the sign in link, we want to assert that we have been redirected to sign in page

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible(); // WE ARE EXPECTING A HEADING OF SIGN IN : Visible asserion

  await page.locator("[name=email]").fill("1@1.com"); // find an element on page that has name email -> fill it with this text
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("Sign In Succesful!")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page
    .locator('[name="description"]')
    .fill("This is a description for the Test Hotel");
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");
  await page.getByText("Budget").click();

  await page.getByLabel("Free Wifi").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("4");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "img1.png"),
    path.join(__dirname, "files", "img2.png"),
  ]);

  await page.getByRole('button', {name : "Save"}).click();

  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});