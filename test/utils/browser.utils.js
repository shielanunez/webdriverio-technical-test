export async function switchToNewWindow(originalWindow) {
    let resultsWindow;

    await browser.waitUntil(
        async () => {
            const handles = await browser.getWindowHandles();

            for (const handle of handles) {
                if (handle === originalWindow) {
                    continue;
                }

                await browser.switchToWindow(handle);

                const url = await browser.getUrl();

                if (url.includes('/flight-search/')) {
                    resultsWindow = handle;
                    return true;
                }
            }

            return false;
        },
        {
            timeout: 30000,
            timeoutMsg: 'Flight search results window did not load'
        }
    );

    await browser.switchToWindow(resultsWindow);

    return resultsWindow;
}