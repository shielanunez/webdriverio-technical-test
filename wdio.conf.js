const path = require('node:path');
const fs = require('node:fs');
const isHeadless = process.env.HEADLESS === 'true';
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
        'goog:chromeOptions': {
            args: [
                ...(isHeadless ? ['--headless=new'] : []),
                '--window-size=1920,1080'
            ]
        },
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
    onPrepare: function () {

        const screenshotsDir = path.resolve('./screenshots');
        if (fs.existsSync(screenshotsDir)) {
            fs.rmSync(screenshotsDir, {
                recursive: true,
                force: true
            });
        }

        fs.mkdirSync(screenshotsDir, {
            recursive: true
        });
    },
    afterTest: async function (test, context, { error }) {
        if (error) {
            const fileName = test.title.replace(/[^a-z0-9]/gi, '_');

            const now = new Date();
            const timestamp = now
                .toLocaleString('en-CA', {
                    timeZone: 'Asia/Manila',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })
                .replace(/:/g, '-')
                .replace(/, /g, '_')
                .replace(/\//g, '-')
                .replace(/\s/g, '');

            await browser.saveScreenshot(
                `./screenshots/${fileName}_${timestamp}.png`
            );
        }
    },
}
