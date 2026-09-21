const path = require('node:path');
const fs = require('node:fs');
const isHeadless = process.env.HEADLESS === 'true';
const allureReporter = require('@wdio/allure-reporter');
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
        const allureResultsDir = path.resolve('./allure-results');
        const allureReportDir = path.resolve('./allure-report');

        // Clear screenshots
        if (fs.existsSync(screenshotsDir)) {
            fs.rmSync(screenshotsDir, {
                recursive: true,
                force: true
            });
        }

        // Clear previous Allure results
        if (fs.existsSync(allureResultsDir)) {
            fs.rmSync(allureResultsDir, {
                recursive: true,
                force: true
            });
        }

        // Clear previous generated Allure report
        if (fs.existsSync(allureReportDir)) {
            fs.rmSync(allureReportDir, {
                recursive: true,
                force: true
            });
        }

        // Recreate screenshots directory
        fs.mkdirSync(screenshotsDir, {
            recursive: true
        });

        // Recreate Allure results directory
        fs.mkdirSync(allureResultsDir, {
            recursive: true
        });
    },
    onComplete: function () {
        const { execSync } = require('node:child_process');
        try {
            execSync(
                'npx allure generate allure-results --clean -o allure-report',
                { stdio: 'inherit' }
            );

            console.log('\nAllure report generated in ./allure-report');
            execSync('npx allure open allure-report', {
                stdio: 'inherit'
            });
        } catch (error) {
            console.error(
                'Failed to generate or open Allure report:',
                error.message
            );
        }
    },
    afterTest: async function (test, context, { error }) {
        if (error) {
            const fileName = test.title.replace(/[^a-z0-9]/gi, '_');

            const now = new Date();

            const timestamp = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Asia/Manila',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
                .format(now)
                .replace(/, /, '_')
                .replace(/:/g, '-');

            const screenshotPath =
                `./screenshots/${fileName}_${timestamp}.png`;

            const screenshot = await browser.takeScreenshot();

            // Save screenshot locally
            const fs = require('node:fs');

            fs.writeFileSync(
                screenshotPath,
                Buffer.from(screenshot, 'base64')
            );

            // Attach screenshot to Allure
            allureReporter.addAttachment(
                'Failure Screenshot',
                Buffer.from(screenshot, 'base64'),
                'image/png'
            );
        }
    },
}
