const path = require('node:path');
const fs = require('node:fs');
exports.config = {

    runner: 'local',
    specs: [
        './test/specs/**/*.js'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],
    maxInstances: 1,
    capabilities: [{
        browserName: 'chrome',
        'wdio:chromedriverOptions': {
            binary: './node_modules/.bin/chromedriver'
        }
    }],
    logLevel: 'info',
    baseUrl: 'https://www.cheapflights.com.au/',
    waitforTimeout: 10000,
    connectionRetryTimeout: 60000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    afterTest: async function (test, context, { error }) {
        if (error) {
            const fileName = test.title.replace(/[^a-z0-9]/gi, '_');

            await browser.saveScreenshot(
                `./screenshots/${fileName}.png`
            );
        }
    },
}
