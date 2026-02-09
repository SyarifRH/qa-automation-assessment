// web-testing/test-script.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function runWebTest() {
  console.log("🚀 Starting Web Application Test - Demoblaze.com");
  console.log("===============================================\n");

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Task 1: Navigate to website
    console.log("✅ Task 1: Navigating to https://www.demoblaze.com");
    await page.goto("https://www.demoblaze.com");
    await page.waitForSelector("body");
    await takeScreenshot(page, "01_navigation");

    // Task 2: Browse and select product
    console.log("✅ Task 2: Selecting product from Phones category");
    await page.getByRole("link", { name: "Phones" });
    await page.click(".card-title >> nth=0");
    await takeScreenshot(page, "02_product_selected");

    // Task 3: Add to cart
    console.log("✅ Task 3: Adding product to cart");
    await page.click('a:has-text("Add to cart")');

    // Handle alert
    page.once("dialog", (dialog) => dialog.accept());
    await page.waitForTimeout(2000);
    await takeScreenshot(page, "03_added_to_cart");

    // Task 4: Navigate to cart and verify
    console.log("✅ Task 4: Verifying cart");
    await page.click("#cartur");
    await page.waitForSelector("tr.success");
    await takeScreenshot(page, "04_cart_verified");

    // Task 5: Complete checkout
    console.log("✅ Task 5: Completing checkout");
    await page.click('button:has-text("Place Order")');
    await page.waitForSelector("#orderModal");

    // Fill form
    await page.fill("#name", "Test Customer");
    await page.fill("#country", "Test Country");
    await page.fill("#city", "Test City");
    await page.fill("#card", "4111111111111111");
    await page.fill("#month", "12");
    await page.fill("#year", "2025");
    await takeScreenshot(page, "05_checkout_form");

    await page.click('button:has-text("Purchase")');

    // Task 6: Verify order confirmation
    console.log("✅ Task 6: Verifying order confirmation");
    await page.waitForSelector(".sweet-alert", { timeout: 10000 });
    await takeScreenshot(page, "06_order_confirmation");

    // Task 7: Capture Order ID
    console.log("✅ Task 7: Capturing Order ID");
    const confirmationText = await page.textContent(".sweet-alert p.lead");
    const orderId = confirmationText.match(/Id: (\d+)/)[1];
    console.log(`🎉 ORDER ID: ${orderId}`);

    // Save order ID
    fs.writeFileSync("web-testing/order_id.txt", orderId);

    console.log("\n✅ WEB TEST COMPLETED SUCCESSFULLY!");
    console.log(`📦 Order ID Captured: ${orderId}`);
  } catch (error) {
    console.error("❌ Test Failed:", error.message);
    await takeScreenshot(page, "ERROR_test_failed");
  } finally {
    await browser.close();
  }
}

async function takeScreenshot(page, name) {
  const dir = "web-testing/screenshots";
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filepath = path.join(dir, `${name}_${Date.now()}.png`);
  await page.screenshot({ path: filepath });
  console.log(`   📸 Screenshot: ${filepath}`);
}

// Run the test
runWebTest();
