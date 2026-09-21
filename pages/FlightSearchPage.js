class FlightSearchPage {

    async verifySearchPageLoaded() {
        const returnTripButton = await this.getVisibleElement(
            '[role="button"][aria-label="Return"]'
        );

        await expect(returnTripButton).toBeDisplayed();
    }

    async getResultsOrigin(origin) {
        return this.getVisibleElement(
            `[role="button"][aria-label^="Flight origin input"][aria-label$="${origin}"]`
        );
    }

    async getResultsDestination(destination) {
        return this.getVisibleElement(
            `[role="button"][aria-label^="Flight destination input"][aria-label$="${destination}"]`
        );
    }

    async getDepartureDate() {
        return this.getVisibleElement(
            '[aria-label^="Departure date"]'
        );
    }

    async getReturnDate() {
        return this.getVisibleElement(
            '[aria-label^="Return date"]'
        );
    }

    async getCabinClass() {
        return this.getVisibleElement(
            '.NITa-cabin[aria-label]'
        );
    }

    async verifySearchDetails({
        origin,
        destination,
        departureDate,
        returnDate,
        cabinClass
    }) {
        const resultsOrigin = await this.getResultsOrigin(origin);
        const resultsDestination =
            await this.getResultsDestination(destination);

        const departureDateElement =
            await this.getDepartureDate();

        const returnDateElement =
            await this.getReturnDate();

        const cabinClassElement =
            await this.getCabinClass();

        await expect(resultsOrigin).toBeDisplayed();

        await expect(resultsDestination).toBeDisplayed();

        await expect(departureDateElement).toHaveAttribute(
            'aria-label',
            `Departure date ${departureDate}`
        );

        await expect(returnDateElement).toHaveAttribute(
            'aria-label',
            `Return date ${returnDate}`
        );

        await expect(cabinClassElement).toHaveAttribute(
            'aria-label',
            cabinClass
        );
    }

    async getVisibleElement(selector) {
        const elements = await $$(selector);

        for (const element of elements) {
            if (await element.isDisplayed()) {
                return element;
            }
        }

        throw new Error(
            `No visible element found for selector: ${selector}`
        );
    }

    async verifySearchResultsExist() {
        await browser.waitUntil(
            async () => {
                const results = await $$(
                    '#flight-results-list-wrapper [role="group"][aria-label^="Result item"]'
                );

                return results.length > 0;
            },
            {
                timeout: 30000,
                timeoutMsg: 'No flight search results were displayed'
            }
        );
    }
}

export default new FlightSearchPage();