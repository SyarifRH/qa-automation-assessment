**1. Executive Summary**

**A. Testing Summary**
This testing was conducted to automate critical scenarios across three different platforms using AI tools:

- **Web Application (DemoBlaze)**: Tests the end-to-end e-commerce flow, from selecting a product and adding it to the cart to completing checkout and verifying the Order ID.

- **API Testing (JSONPlaceholder)**: Tests the REST API endpoint for positive scenarios (retrieving data, creating new data) and negative scenarios (sending invalid data, accessing non-existent resources).

- **Mobile Application (WebdriverIO Native Demo App)**: Tests the core functionality of the Android native app, including the Login Flow, Form interactions, and swipe gestures.

**b. Test Results Summary**

| Platform | Scenario           | Results                  | Notes                                                           |
| :------- | :----------------- | :----------------------- | :-------------------------------------------------------------- |
| Web      | E2E Purchase Flow  | ✅ Successful            | Order ID successfully captured from the confirmation page.      |
| API      | GET /posts         | ✅ Successful            | Response 200 OK, data properly formatted.                       |
| API      | POST /posts        | ✅ Successful            | Response 201 Created, new ID generated.                         |
| API      | GET /posts/invalid | ✅ Successful (Negative) | Response 404 Not Found, as expected.                            |
| Mobile   | Login Flow         | ✅ Successful            | Successfully logged in with existing credentials in the app.    |
| Mobile   | Forms Test         | ✅ Successful            | All interactions (text input, toggle, dropdown) work correctly. |
| Mobile   | Swipe Gesture      | ✅ Successful            | Content changes when swiping horizontally.                      |

**c. Key Findings and Insights**

- **Selector Consistency**: In mobile testing, it is crucial to use the right selectors (such as accessibility IDs) because they are more stable compared to text-based or class-based selectors which can change.

- **Wait Handling**: Both in web and mobile testing, explicit waits are essential to avoid false positives caused by elements that have not yet appeared.

- **Data Mocking**: For negative API testing, using deliberately incorrect data (such as string-based IDs) is effective for validating server-side validation.

- **AI Acceleration**: AI significantly helps accelerate boilerplate code writing and error debugging.

**2. AI Tools Usage Report**

**a. Tools Used**

- **GitHub Copilot**: Used in Visual Studio Code for writing Web (JavaScript) and Mobile (WebdriverIO) scripts.
- **ChatGPT (GPT-4)**: Used for:
  - Helping formulate unique selector strategies for mobile applications.
  - Creating data structures for API testing (positive & negative cases).
  - Assisting in writing code for complex swipe gestures on mobile.
  - Helping compile this documentation.

**b. Testing Process Acceleration**

- **Boilerplate Code Creation**: Copilot automatically completes WebdriverIO syntax, reducing manual typing time by up to 40%.
- **Debugging**: When encountering 'element not interactable' errors on the web, ChatGPT provided suggestions to add `browser.pause()` or wait for other elements to finish loading first.
- **Test Data Generation**: AI was used to generate various test data variations (e.g., 10 examples of post titles for API testing) in seconds.

**c. Specific Example of AI-Generated Code**

- **Prompt to ChatGPT**: "Create a function in JavaScript (WebdriverIO) to perform a horizontal swipe on an element with the id 'cardCarousel' until the text 'Last Card' is visible."
- **AI Result (subsequently modified)**:

```javascript
// mobile-testing/test-script.js (Swipe Section)
async function swipeUntilTextVisible(targetText) {
  const carousel = await $("~cardCarousel"); // Using accessibility id
  let isTextFound = false;

  for (let i = 0; i < 5; i++) {
    // Maximum 5 swipes
    if (await $(`~${targetText}`).isDisplayed()) {
      isTextFound = true;
      break;
    }
    await driver.touchAction([
      { action: "press", x: 800, y: 500 }, // Start position
      { action: "wait", ms: 500 },
      { action: "moveTo", x: 100, y: 500 }, // End position
      "release",
    ]);
    await driver.pause(1000);
  }
  return isTextFound;
}
```

**d. Pros and Cons of Using AI for Test Automation**

| Pros                                                                                       | Cons                                                                                                                                               |
| :----------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Speed**: Very effective at quickly writing boilerplate code.                             | **Lack of Context**: AI doesn't deeply understand the application's UI/UX. Generated code might work technically but not align with business flow. |
| **Idea Generation**: Helps identify potential edge cases that might be missed.             | **Outdated Code**: AI sometimes generates syntax or methods that are already deprecated. Manual validation is required.                            |
| **Debugging Assistant**: Quickly finds solutions for error messages.                       | **Dependency**: Over-reliance on AI can reduce manual problem-solving skills and syntax understanding.                                             |
| **Helps Non-Natives**: Facilitates writing code for less familiar languages or frameworks. | **Privacy & Security**: Cannot be used for sensitive internal code.                                                                                |

---

**4. Edge Cases & Quality Insights**
Here are 5 edge cases with the potential to cause application failure and proposed testing strategies:

- **Case**: User attempts checkout with an empty shopping cart.
  - **Scenario**: Directly access the cart page and click "Place Order" without any products.
  - **Test Proposal**: Automate a script that navigates directly to `/cart.html` (if possible) and clicks the checkout button. Verify whether the system allows payment (it should not) or displays an error message like "Your cart is still empty." The expected result is a failed checkout with an appropriate notification.

- **Case**: API returns a 500 (Internal Server Error) error when POSTing data.
  - **Scenario**: The server is experiencing issues or the database is inaccessible.
  - **Test Proposal**: Use a mock server or interceptor (like Mock Service Worker or Charles Proxy) to simulate an API response with a 500 status. Then, run the frontend application and observe its reaction. Does the application crash, or does it display a user-friendly message like "Failed to process order, please try again later?"

- **Case**: Mobile app loses internet connection immediately after pressing the "Login" button.
  - **Scenario**: User enters an area with signal loss during the authentication process.
  - **Test Proposal**:
    1.  Run an emulator with the app open on the Login page.
    2.  Enter credentials.
    3.  Press the Login button.
    4.  Immediately disable WiFi/Data on the emulator.
    5.  Verify if the app displays a timeout error or a pop-up like "No internet connection." Ensure the app does not freeze or force close.

- **Case**: Text input in a form exceeds the maximum character limit.
  - **Scenario**: User pastes a long paragraph into an input field that only accepts 50 characters.
  - **Test Proposal**: In the mobile script (Forms Test), send a 200-character string into the text field. Then, verify:
    - Does the app prevent input (only the first 50 characters are saved)?
    - Or does the app allow input but truncate it upon submission?
    - Does any warning message appear?

- **Case**: Forced back navigation during the checkout process.
  - **Scenario**: On the web, the user presses the browser's "Back" button after clicking "Purchase" but before the confirmation page finishes loading.
  - **Test Proposal**:
    1.  Automate a script to fill out the checkout form.
    2.  Click "Purchase."
    3.  Without waiting, execute the `browser.back()` command.
    4.  Verify whether the user is returned to the cart page or product page, and whether the order data becomes duplicated or corrupted on the user's side.

---

**5. Scalability Strategy (Bonus)**
If we needed to scale this testing effort to 100+ test cases, the following approach would be used:

**a. Framework Approach**

- **Modularization (Page Object Model - POM)**: Separate code based on pages or components. Create dedicated files like `LoginPage.js`, `CartPage.js`, `ApiHelper.js`. This makes code more reusable and easier to maintain.
  - _Example_: To add 10 new login test cases, we simply call `loginPage.login('user','pass')` without rewriting element selectors each time.

**b. CI/CD Integration**

- **Automated Pipeline**: Integrate the test suite into a CI/CD pipeline such as GitHub Actions, Jenkins, or GitLab CI.
- **Trigger**: Run tests automatically on every pull request to the `main` branch or nightly (nightly build).
- **Reporting**: Use reporters like Allure Report to generate interactive test reports that are easy for the team to read. Store screenshots from each failure as artifacts in the CI system.

**c. Long-Term Maintenance Strategy**

- **Data-Driven Testing**: Separate test data from code. Use JSON or Excel files to store credentials, form inputs, and expected results. This simplifies updating data without modifying the code.
- **Regular Review**: Schedule monthly reviews to remove obsolete or redundant test cases.
- **Stability First**: Prioritize writing test cases for core business features that change infrequently. Tests for frequently changing UIs should be minimized or written at the unit/integration level.
- **AI-Assisted Maintenance**: Use AI tools to help fix broken selectors caused by UI changes. AI can assist in analyzing error logs and provide suggestions for faster fixes.
