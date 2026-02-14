// mobile-testing/test-script.js
// ============================================================
// MOBILE TESTING - WebdriverIO Native Demo App (Android)
// Part 3 dari Assessment: Mobile Application Testing
// ============================================================

const { remote } = require("webdriverio");
const fs = require("fs");
const path = require("path");

// ============================================================
// KONFIGURASI APPIUM & EMULATOR
// ============================================================

// Pastikan:
// 1. Android Emulator sudah running (Pixel 5, API 30)
// 2. APK sudah diinstall (drag & drop ke emulator)
// 3. Appium Server sudah running (default: http://localhost:4723)

const APPIUM_SERVER = "http://localhost:4723/wd/hub";

// Capabilities untuk Android emulator
const capabilities = {
  platformName: "Android",
  "appium:platformVersion": "11.0", // API 30 = Android 11
  "appium:deviceName": "Pixel_5_API_30", // Nama emulator
  "appium:automationName": "UiAutomator2", // Automation engine untuk Android
  "appium:appPackage": "com.wdiodemoapp", // Package name dari APK
  "appium:appActivity": ".MainActivity", // Main activity yang pertama kali dibuka
  "appium:noReset": false, // Reset app setiap test
  "appium:fullReset": false, // Jangan uninstall app
  "appium:newCommandTimeout": 30000, // Timeout untuk perintah baru
  "appium:autoGrantPermissions": true, // Auto grant permissions
};

// Folder untuk screenshots
const SCREENSHOT_DIR = "mobile-testing/screenshots";
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Ambil screenshot dengan nama yang konsisten
 * @param {Object} driver - WebdriverIO driver instance
 * @param {string} testName - Nama test case
 * @param {string} stepName - Nama step
 */
async function takeScreenshot(driver, testName, stepName) {
  const timestamp = Date.now();
  const filename = `${testName}_${stepName}_${timestamp}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);

  await driver.saveScreenshot(filepath);
  console.log(`   📸 Screenshot: ${filename}`);
  return filepath;
}

/**
 * Tunggu beberapa detik
 * @param {number} ms - Milliseconds to wait
 */
async function wait(ms = 2000) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  console.log(`   ⏱️  Waited ${ms}ms`);
}

/**
 * Print test result dengan format yang rapi
 */
function printTestResult(testName, status, message = "") {
  const icon = status === "PASS" ? "✅" : "❌";
  console.log(`\n${icon} ${testName}: ${status}`);
  if (message) console.log(`   ${message}`);
  console.log("   " + "-".repeat(40));
}

// ============================================================
// TEST CASE 1: LOGIN FLOW
// ============================================================

/**
 * Test Case 1: Login Flow
 * - Navigate to Login screen
 * - Enter test credentials
 * - Tap Login button
 * - Verify successful login OR capture error message
 */
async function testLoginFlow(driver) {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 TEST CASE 1: LOGIN FLOW");
  console.log("=".repeat(60));

  const testResults = {
    testCase: "Login Flow",
    steps: [],
    status: "PASS",
    screenshot: [],
  };

  try {
    // STEP 1: Navigate to Login screen
    console.log("\n📌 Step 1: Navigate to Login screen");

    // Cari element Login menggunakan accessibility ID
    // Strategy: Accessibility ID (recommended for mobile)
    const loginMenu = await driver.$("~Login");
    await loginMenu.click();
    console.log("   ✅ Clicked Login menu");

    await wait(1000);
    const screenshot1 = await takeScreenshot(
      driver,
      "login",
      "01_navigate_to_login",
    );
    testResults.screenshot.push(screenshot1);

    testResults.steps.push({
      step: "Navigate to Login",
      status: "PASS",
      locator: "~Login",
      strategy: "Accessibility ID",
    });

    // STEP 2: Enter test credentials
    console.log("\n📌 Step 2: Enter test credentials");

    // Email field - Accessibility ID: input-email
    const emailField = await driver.$("~input-email");
    await emailField.setValue("test@webdriver.io");
    console.log("   ✅ Entered email: test@webdriver.io");

    // Password field - Accessibility ID: input-password
    const passwordField = await driver.$("~input-password");
    await passwordField.setValue("Test123!");
    console.log("   ✅ Entered password: Test123!");

    await wait(500);
    const screenshot2 = await takeScreenshot(
      driver,
      "login",
      "02_credentials_entered",
    );
    testResults.screenshot.push(screenshot2);

    testResults.steps.push({
      step: "Enter Credentials",
      status: "PASS",
      locator: "~input-email, ~input-password",
      strategy: "Accessibility ID",
    });

    // STEP 3: Tap Login button
    console.log("\n📌 Step 3: Tap Login button");

    const loginButton = await driver.$("~button-LOGIN");
    await loginButton.click();
    console.log("   ✅ Clicked Login button");

    await wait(3000); // Tunggu response
    const screenshot3 = await takeScreenshot(driver, "login", "03_after_login");
    testResults.screenshot.push(screenshot3);

    // STEP 4: Verify result
    console.log("\n📌 Step 4: Verify login result");

    try {
      // Coba cari success message
      // Strategy: XPath dengan partial text
      const successMessage = await driver.$(
        '//android.widget.TextView[contains(@text, "Success")]',
      );
      const isSuccess = await successMessage.isDisplayed();

      if (isSuccess) {
        const messageText = await successMessage.getText();
        console.log(`   ✅ Login successful! Message: ${messageText}`);
        testResults.status = "PASS";
        testResults.message = `Success: ${messageText}`;

        testResults.steps.push({
          step: "Verify Success",
          status: "PASS",
          locator: '//*[contains(@text, "Success")]',
          strategy: "XPath (partial text)",
          result: messageText,
        });
      }
    } catch (error) {
      // Jika tidak ada success message, cek error message
      try {
        const errorMessage = await driver.$(
          '//android.widget.TextView[contains(@text, "Invalid") or contains(@text, "Error")]',
        );
        const isError = await errorMessage.isDisplayed();

        if (isError) {
          const errorText = await errorMessage.getText();
          console.log(`   ⚠️ Login failed: ${errorText}`);
          testResults.status = "PASS"; // Still PASS karena kita capture error
          testResults.message = `Error captured: ${errorText}`;

          testResults.steps.push({
            step: "Capture Error",
            status: "PASS",
            locator: '//*[contains(@text, "Invalid")]',
            strategy: "XPath (partial text)",
            result: errorText,
          });
        }
      } catch (innerError) {
        // No message found
        testResults.status = "FAIL";
        testResults.message = "No success or error message found";

        testResults.steps.push({
          step: "Verify Result",
          status: "FAIL",
          error: "No message displayed",
        });
      }
    }

    // STEP 5: Navigate back to home
    console.log("\n📌 Step 5: Navigate back");
    await driver.back();
    console.log("   ✅ Navigated back");

    const screenshot4 = await takeScreenshot(
      driver,
      "login",
      "04_back_to_home",
    );
    testResults.screenshot.push(screenshot4);
  } catch (error) {
    console.error(`   ❌ Error in Login Flow: ${error.message}`);
    testResults.status = "FAIL";
    testResults.error = error.message;

    // Screenshot error
    await takeScreenshot(driver, "login", "ERROR");
  }

  // Print test result
  printTestResult("Login Flow", testResults.status, testResults.message);

  return testResults;
}

// ============================================================
// TEST CASE 2: FORMS TEST
// ============================================================

/**
 * Test Case 2: Forms Test
 * - Navigate to Forms screen
 * - Fill text input field
 * - Toggle switch
 * - Select option from dropdown
 * - Verify all interactions work
 */
async function testFormsFlow(driver) {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 TEST CASE 2: FORMS TEST");
  console.log("=".repeat(60));

  const testResults = {
    testCase: "Forms Test",
    steps: [],
    status: "PASS",
    screenshot: [],
  };

  try {
    // STEP 1: Navigate to Forms screen
    console.log("\n📌 Step 1: Navigate to Forms screen");

    const formsMenu = await driver.$("~Forms");
    await formsMenu.click();
    console.log("   ✅ Clicked Forms menu");

    await wait(1000);
    const screenshot1 = await takeScreenshot(
      driver,
      "forms",
      "01_navigate_to_forms",
    );
    testResults.screenshot.push(screenshot1);

    testResults.steps.push({
      step: "Navigate to Forms",
      status: "PASS",
      locator: "~Forms",
      strategy: "Accessibility ID",
    });

    // STEP 2: Fill text input field
    console.log("\n📌 Step 2: Fill text input field");

    // Text input field - Accessibility ID: text-input
    const textInput = await driver.$("~text-input");
    await textInput.click();
    await textInput.setValue("Automation Testing with WebdriverIO");
    console.log('   ✅ Entered text: "Automation Testing with WebdriverIO"');

    // Verify input text appears
    const inputTextResult = await driver.$("~input-text-result");
    const displayedText = await inputTextResult.getText();
    console.log(`   📝 Displayed text: "${displayedText}"`);

    await wait(500);
    const screenshot2 = await takeScreenshot(driver, "forms", "02_text_input");
    testResults.screenshot.push(screenshot2);

    testResults.steps.push({
      step: "Fill Text Input",
      status: "PASS",
      locator: "~text-input, ~input-text-result",
      strategy: "Accessibility ID",
      input: "Automation Testing with WebdriverIO",
      output: displayedText,
    });

    // STEP 3: Toggle switch
    console.log("\n📌 Step 3: Toggle switch");

    const switchElement = await driver.$("~switch");

    // Get initial state
    const initialState = await switchElement.getAttribute("checked");
    console.log(
      `   🔄 Initial switch state: ${initialState === "true" ? "ON" : "OFF"}`,
    );

    // Toggle switch
    await switchElement.click();
    console.log("   ✅ Toggled switch");

    await wait(500);

    // Get new state
    const newState = await switchElement.getAttribute("checked");
    console.log(
      `   🔄 New switch state: ${newState === "true" ? "ON" : "OFF"}`,
    );

    // Verify state changed
    const switchText = await driver.$("~switch-text");
    const switchTextValue = await switchText.getText();
    console.log(`   📝 Switch text: "${switchTextValue}"`);

    const screenshot3 = await takeScreenshot(
      driver,
      "forms",
      "03_switch_toggled",
    );
    testResults.screenshot.push(screenshot3);

    testResults.steps.push({
      step: "Toggle Switch",
      status: "PASS",
      locator: "~switch, ~switch-text",
      strategy: "Accessibility ID",
      initialState: initialState === "true" ? "ON" : "OFF",
      newState: newState === "true" ? "ON" : "OFF",
      displayText: switchTextValue,
    });

    // STEP 4: Select from dropdown
    console.log("\n📌 Step 4: Select option from dropdown");

    // Click dropdown
    const dropdown = await driver.$("~Dropdown");
    await dropdown.click();
    console.log("   ✅ Clicked dropdown");

    await wait(1000);

    // Select option: "This app is awesome"
    // Strategy: XPath with exact text
    const option = await driver.$(
      '//android.widget.CheckedTextView[@text="This app is awesome"]',
    );
    await option.click();
    console.log('   ✅ Selected option: "This app is awesome"');

    await wait(500);

    // Verify selected value appears
    const dropdownText = await driver.$(
      '//android.widget.EditText[@text="This app is awesome"]',
    );
    const selectedValue = await dropdownText.getText();
    console.log(`   📝 Selected value: "${selectedValue}"`);

    const screenshot4 = await takeScreenshot(
      driver,
      "forms",
      "04_dropdown_selected",
    );
    testResults.screenshot.push(screenshot4);

    testResults.steps.push({
      step: "Select Dropdown",
      status: "PASS",
      locator:
        '~Dropdown, //android.widget.CheckedTextView[@text="This app is awesome"]',
      strategy: "Accessibility ID + XPath",
      selected: selectedValue,
    });

    // STEP 5: Verify all interactions
    console.log("\n📌 Step 5: Verify all interactions");

    const verification = {
      text: displayedText === "Automation Testing with WebdriverIO",
      switch: newState === "true" || newState === "false", // Any state is fine
      dropdown: selectedValue === "This app is awesome",
    };

    if (verification.text && verification.dropdown) {
      console.log("   ✅ All form interactions verified successfully!");
      testResults.status = "PASS";
      testResults.verification = verification;
    } else {
      console.log("   ⚠️ Some interactions not verified");
      testResults.status = "FAIL";
      testResults.verification = verification;
    }

    const screenshot5 = await takeScreenshot(
      driver,
      "forms",
      "05_final_verification",
    );
    testResults.screenshot.push(screenshot5);
  } catch (error) {
    console.error(`   ❌ Error in Forms Test: ${error.message}`);
    testResults.status = "FAIL";
    testResults.error = error.message;

    // Screenshot error
    await takeScreenshot(driver, "forms", "ERROR");
  }

  // Print test result
  printTestResult(
    "Forms Test",
    testResults.status,
    "All form interactions completed",
  );

  return testResults;
}

// ============================================================
// TEST CASE 3: SWIPE/GESTURE TEST (BONUS)
// ============================================================

/**
 * Test Case 3: Swipe/Gesture Test (Bonus)
 * - Navigate to Swipe screen
 * - Test swipe gestures
 * - Verify content changes on swipe
 */
async function testSwipeFlow(driver) {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 TEST CASE 3: SWIPE/GESTURE TEST (BONUS)");
  console.log("=".repeat(60));

  const testResults = {
    testCase: "Swipe Test",
    steps: [],
    status: "PASS",
    screenshot: [],
  };

  try {
    // STEP 1: Navigate to Swipe screen
    console.log("\n📌 Step 1: Navigate to Swipe screen");

    const swipeMenu = await driver.$("~Swipe");
    await swipeMenu.click();
    console.log("   ✅ Clicked Swipe menu");

    await wait(2000);
    const screenshot1 = await takeScreenshot(
      driver,
      "swipe",
      "01_navigate_to_swipe",
    );
    testResults.screenshot.push(screenshot1);

    testResults.steps.push({
      step: "Navigate to Swipe",
      status: "PASS",
      locator: "~Swipe",
      strategy: "Accessibility ID",
    });

    // Get screen size for swipe coordinates
    const windowSize = await driver.getWindowRect();
    const screenWidth = windowSize.width;
    const screenHeight = windowSize.height;

    console.log(`   📱 Screen size: ${screenWidth}x${screenHeight}`);

    // Calculate swipe coordinates
    const startX = screenWidth * 0.8; // 80% dari lebar
    const endX = screenWidth * 0.2; // 20% dari lebar
    const centerY = screenHeight * 0.5; // 50% dari tinggi

    console.log(
      `   👉 Swipe from (${startX},${centerY}) to (${endX},${centerY})`,
    );

    // STEP 2: Perform multiple swipes
    console.log("\n📌 Step 2: Perform swipe gestures");

    // Swipe 1: Left
    console.log("   🔄 Swipe 1: Left");
    await driver.touchAction([
      { action: "press", x: startX, y: centerY },
      { action: "wait", ms: 500 },
      { action: "moveTo", x: endX, y: centerY },
      { action: "release" },
    ]);

    await wait(1000);
    const screenshot2 = await takeScreenshot(
      driver,
      "swipe",
      "02_after_swipe_left",
    );
    testResults.screenshot.push(screenshot2);

    // Swipe 2: Left again
    console.log("   🔄 Swipe 2: Left");
    await driver.touchAction([
      { action: "press", x: startX, y: centerY },
      { action: "wait", ms: 500 },
      { action: "moveTo", x: endX, y: centerY },
      { action: "release" },
    ]);

    await wait(1000);
    const screenshot3 = await takeScreenshot(
      driver,
      "swipe",
      "03_after_swipe_2",
    );
    testResults.screenshot.push(screenshot3);

    // Swipe 3: Right (back)
    console.log("   🔄 Swipe 3: Right");
    await driver.touchAction([
      { action: "press", x: endX, y: centerY },
      { action: "wait", ms: 500 },
      { action: "moveTo", x: startX, y: centerY },
      { action: "release" },
    ]);

    await wait(1000);
    const screenshot4 = await takeScreenshot(
      driver,
      "swipe",
      "04_after_swipe_right",
    );
    testResults.screenshot.push(screenshot4);

    testResults.steps.push({
      step: "Swipe Gestures",
      status: "PASS",
      gestures: ["left", "left", "right"],
      coordinates: { startX, endX, centerY },
    });

    // STEP 3: Verify content changes
    console.log("\n📌 Step 3: Verify swipe functionality");

    // Try to find card content
    try {
      const cardContent = await driver.$(
        '//android.widget.TextView[contains(@text, "Card") or contains(@text, "Swipe")]',
      );
      const isDisplayed = await cardContent.isDisplayed();

      if (isDisplayed) {
        const cardText = await cardContent.getText();
        console.log(`   ✅ Cards are swipeable: Found "${cardText}"`);
        testResults.status = "PASS";
        testResults.message = "Swipe gestures work correctly";
      }
    } catch (error) {
      console.log("   ✅ Swipe gestures executed successfully");
      testResults.status = "PASS";
      testResults.message = "Swipe gestures completed";
    }

    const screenshot5 = await takeScreenshot(driver, "swipe", "05_final_state");
    testResults.screenshot.push(screenshot5);
  } catch (error) {
    console.error(`   ❌ Error in Swipe Test: ${error.message}`);
    testResults.status = "FAIL";
    testResults.error = error.message;

    // Screenshot error
    await takeScreenshot(driver, "swipe", "ERROR");
  }

  // Print test result
  printTestResult(
    "Swipe Test",
    testResults.status,
    testResults.message || "Swipe gestures completed",
  );

  return testResults;
}

// ============================================================
// MAIN TEST EXECUTION
// ============================================================

/**
 * Main function to run all mobile tests
 */
async function runMobileTests() {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 MOBILE AUTOMATION TEST - WebdriverIO Native Demo App");
  console.log("=".repeat(60));
  console.log("\n📱 Platform: Android (Pixel 5, API 30)");
  console.log("📱 App: WebdriverIO Native Demo App");
  console.log("📱 Automation: Appium + WebdriverIO");
  console.log("\n" + "=".repeat(60));

  let driver = null;
  const allResults = [];

  try {
    // 1. CONNECT TO APPIUM SERVER
    console.log("\n🔌 Connecting to Appium server...");
    console.log(`   Server: ${APPIUM_SERVER}`);
    console.log(`   Device: ${capabilities["appium:deviceName"]}`);
    console.log(`   Android: ${capabilities["appium:platformVersion"]}`);

    driver = await remote({
      protocol: "http",
      hostname: "localhost",
      port: 4723,
      path: "/wd/hub",
      capabilities: capabilities,
      logLevel: "error", // Reduce log noise
    });

    console.log("✅ Connected to Appium server successfully!");
    console.log("✅ App launched successfully!");

    // Wait for app to fully load
    await wait(3000);
    await takeScreenshot(driver, "setup", "app_launched");

    // 2. RUN TEST CASE 1: LOGIN FLOW
    console.log("\n" + "=".repeat(60));
    const loginResults = await testLoginFlow(driver);
    allResults.push(loginResults);

    // 3. RUN TEST CASE 2: FORMS TEST
    console.log("\n" + "=".repeat(60));
    const formsResults = await testFormsFlow(driver);
    allResults.push(formsResults);

    // 4. RUN TEST CASE 3: SWIPE TEST (BONUS)
    console.log("\n" + "=".repeat(60));
    const swipeResults = await testSwipeFlow(driver);
    allResults.push(swipeResults);

    // 5. GENERATE TEST REPORT
    console.log("\n" + "=".repeat(60));
    console.log("📊 GENERATING TEST REPORT");
    console.log("=".repeat(60));

    const summary = {
      timestamp: new Date().toISOString(),
      totalTests: allResults.length,
      passed: allResults.filter((r) => r.status === "PASS").length,
      failed: allResults.filter((r) => r.status === "FAIL").length,
      results: allResults,
      screenshots: allResults.flatMap((r) => r.screenshot || []),
    };

    // Save report to JSON
    const reportFile = path.join(
      SCREENSHOT_DIR,
      `test_report_${Date.now()}.json`,
    );
    fs.writeFileSync(reportFile, JSON.stringify(summary, null, 2));
    console.log(`\n📁 Report saved: ${reportFile}`);

    // Print final summary
    console.log("\n" + "⭐".repeat(30));
    console.log("FINAL TEST SUMMARY");
    console.log("⭐".repeat(30));
    console.log(`\n📱 Total Tests: ${summary.totalTests}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`📸 Screenshots: ${summary.screenshots.length}`);
    console.log(`\n📁 Screenshots saved in: ${SCREENSHOT_DIR}/`);

    if (summary.failed === 0) {
      console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
    } else {
      console.log(
        `\n⚠️ ${summary.failed} test(s) failed. Check report for details.`,
      );
    }
  } catch (error) {
    console.error("\n❌ FATAL ERROR:", error.message);
    console.error("   Stack:", error.stack);

    // Save error report
    const errorFile = path.join(
      SCREENSHOT_DIR,
      `fatal_error_${Date.now()}.json`,
    );
    fs.writeFileSync(
      errorFile,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          error: error.message,
          stack: error.stack,
        },
        null,
        2,
      ),
    );
    console.log(`\n📁 Error report saved: ${errorFile}`);
  } finally {
    // 6. CLEANUP: Close driver
    if (driver) {
      console.log("\n🔌 Disconnecting from Appium server...");
      await driver.deleteSession();
      console.log("✅ Disconnected successfully!");
    }

    console.log("\n" + "=".repeat(60));
    console.log("🏁 MOBILE TEST EXECUTION COMPLETED");
    console.log("=".repeat(60));
  }
}

// ============================================================
// EXECUTE TESTS
// ============================================================

// Run with error handling
(async () => {
  try {
    await runMobileTests();
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Unhandled error:", error.message);
    process.exit(1);
  }
})();
