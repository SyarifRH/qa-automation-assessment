// playwright.config.js
const { defineConfig, devices } = require("@playwright/web-testing");

module.exports = defineConfig({
  testDir: "./web-testing",
  timeout: 60000, // 1 minute timeout
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 3,

  reporter: [
    ["html", { outputFolder: "reports/html", open: "never" }],
    ["json", { outputFolder: "reports/json" }],
    ["junit", { outputFolder: "reports/junit" }],
    ["line"],
  ],

  use: {
    baseURL: "https://www.demoblaze.com",
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
