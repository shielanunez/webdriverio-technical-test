# WebdriverIO Technical Assessment

Web automation and API automation test suite developed as part of the QA Automation technical assessment.

## Tech Stack

- WebdriverIO
- JavaScript
- Node.js
- Mocha
- Chai
- Chrome / ChromeDriver
- Allure Report

## Project Structure

```text
webdriverio-technical-test/
├── pages/
│   ├── HomePage.js
│   └── FlightSearchPage.js
├── test/
│   ├── data/
│   │   ├── booking.data.js
│   │   ├── flight-search.data.js
│   │   └── search-error.data.js
│   ├── specs/
│   │   ├── api/
│   │   │   └── booking.spec.js
│   │   └── web/
│   │       ├── cheapflights.spec.js
│   │       └── flight-search.spec.js
│   └── utils/
│       ├── browser.utils.js
│       ├── booking.api.js
│       └── date.utils.js
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── wdio.conf.js
```

## Test Coverage

### Web Automation

Application under test:

https://www.cheapflights.com.au/

The web automation covers:

- Cheapflights homepage validation
  - Verify the Cheapflights logo is displayed
  - Verify the Sign In button is displayed
  - Verify the Sign In button is positioned to the right of the logo
- Flight search
  - Select origin
  - Select destination
  - Select cabin class
  - Select departure date
  - Select return date
  - Verify flight search details
  - Verify flight search results
- Negative scenarios
  - Search without selecting an origin
  - Search without selecting a destination
  - Verify search validation messages

### API Automation

API under test:

https://restful-booker.herokuapp.com/

The API automation covers:

- Create booking
- Update booking
- Retrieve booking
- Delete booking
- Verify deleted booking returns `404`
- Retrieve a non-existent booking
- Update booking without authentication
- Delete booking without authentication
- HTTP status code assertions
- Response field assertions
- API request chaining using dynamically created booking IDs and authentication tokens

## Test Execution

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Google Chrome

### Install Dependencies

From the project root, run:

```bash
npm install
```

### Web Automation Tests

Run the web automation tests in headed mode:

```bash
npm run test:web
```

**Headed mode is recommended for the Cheapflights web tests.**

During testing, the Cheapflights website was observed to detect and flag the automation as a bot when the tests were executed in headless mode. This can prevent the flight search flow from completing successfully.

For this reason, headed mode is recommended when running the web automation.

### Web Automation — Headless Mode

Headless execution is also available:

```bash
npm run test:web:headless
```

However, headless execution may be affected by the website's bot-detection mechanism and is therefore not recommended for the Cheapflights web tests.

### API Automation Tests

Run the API tests independently:

```bash
npm run test:api
```

The API tests do not require a browser.

### Run All Tests

To execute both web and API tests:

```bash
npm test
```

The web tests run in headed mode by default.

## Test Reports

The project uses the WebdriverIO Spec Reporter and Allure Report.

### Terminal Report

Test execution results are displayed in the terminal using the WebdriverIO Spec Reporter.

### Allure Report

Allure results are automatically generated after test execution.

Previous Allure results are cleared before each test run to ensure that the report contains only results from the latest execution.

Generated Allure files:

```text
allure-results/
allure-report/
```

To open the generated Allure report:

```bash
npm run allure:open
```

### Failure Screenshots

When a web test fails, a screenshot is automatically captured.

Failure screenshots are:

- Saved locally under `screenshots/`
- Attached to the corresponding Allure test result
- Named using the test name and timestamp

Example:

```text
should_display_an_error_message_when_no_origin_is_selected_2026-09-22_07-15-32.png
```

Previous screenshots are automatically cleared at the beginning of each test run.

## Locator Strategy

The automation prioritizes stable and meaningful locators.

The preferred locator strategy is:

1. Test-specific attributes
2. Accessibility attributes such as `role` and `aria-label`
3. Semantic HTML and accessible text
4. Stable IDs
5. Stable CSS selectors
6. XPath when necessary

For example:

```js
$('[role="button"][aria-label="Search"]')
```

is preferred over relying on generated CSS classes.

## Framework Design

The project follows the Page Object Model (POM) approach for web automation.

### Page Objects

Page objects contain:

- Element locators
- Page-specific actions
- Reusable validation methods

This keeps the test cases focused on the test scenario rather than implementation details.

### Test Data

Test data is separated from test logic under:

```text
test/data/
```

Examples include:

- Flight search data
- API booking data
- Search validation messages

Dynamic flight dates are generated through utility functions.

### Utilities

Reusable functionality is separated under:

```text
test/utils/
```

Examples include:

- Browser and window handling
- Dynamic date generation
- API request handling

## Quick Reference

| Purpose | Command |
|---|---|
| Install dependencies | `npm install` |
| Run all tests | `npm test` |
| Run web tests — headed | `npm run test:web` |
| Run web tests — headless | `npm run test:web:headless` |
| Run API tests | `npm run test:api` |
| Open Allure report | `npm run allure:open` |

## Notes

- Chrome and ChromeDriver are used for web automation.
- Headed mode is recommended for Cheapflights web automation because headless execution may trigger the website's bot-detection mechanism.
- API tests can be executed independently without launching a browser.
- Failure screenshots are automatically captured and attached to Allure.
- Previous screenshots and Allure results are cleared automatically before each test run.
- The Allure HTML report is automatically generated after test execution.
- Generated test artifacts such as screenshots, Allure results, and Allure reports are excluded from Git through `.gitignore`.
