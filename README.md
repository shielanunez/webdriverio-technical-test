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
