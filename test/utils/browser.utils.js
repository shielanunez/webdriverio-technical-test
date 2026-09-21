export async function switchToNewWindow(originalWindow) {
    await browser.waitUntil(
        async () => {
            const handles = await browser.getWindowHandles();
            return handles.length > 1;
        },
        {
            timeout: 30000,
            timeoutMsg: 'Flight search results window did not open'
        }
    );

    const handles = await browser.getWindowHandles();

    const newWindow = handles.find(
        handle => handle !== originalWindow
    );

    if (!newWindow) {
        throw new Error('Could not find the flight search results window');
    }

    await browser.switchToWindow(newWindow);

    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            return url.includes('/flight-search/');
        },
        {
            timeout: 30000,
            timeoutMsg: 'Flight search results page did not load'
        }
    );

    return newWindow;
}