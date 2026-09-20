class FlightSearchPage {

    get resultsOrigin() {
        return $(
            '[aria-hidden="false"] [role="button"][aria-label^="Flight origin input"]'
        );
    }

    get resultsDestination() {
        return $(
            '[aria-hidden="false"] [role="button"][aria-label^="Flight destination input"]'
        );
    }

    get departureDate() {
        return $(
            '[aria-hidden="false"] [aria-label^="Departure date"]'
        );
    }

    get returnDate() {
        return $(
            '[aria-hidden="false"] [aria-label^="Return date"]'
        );
    }

    get cabinClass() {
        return $(
            '[aria-hidden="false"] .NITa-cabin[aria-label]'
        );
    }

    async getReturnTripButton() {
        return this.getVisibleElement(
            '[role="button"][aria-label="Return"]'
        );

    }

    async getResultsOrigin(origin) {

        return this.getVisibleElement(

            `[role="option"][aria-label="${origin}"]`

        );

    }

    async getResultsDestination(destination) {

        return this.getVisibleElement(

            `[role="option"][aria-label="${destination}"]`

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

        const resultsDestination = await this.getResultsDestination(destination);

        await expect(resultsOrigin).toBeDisplayed();

        await expect(resultsDestination).toBeDisplayed();

        await expect(this.departureDate).toHaveAttribute(
            'aria-label',
            `Departure date ${departureDate}`
        );

        await expect(this.returnDate).toHaveAttribute(
            'aria-label',
            `Return date ${returnDate}`
        );

        await expect(this.cabinClass).toHaveAttribute(
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
}
export default new FlightSearchPage();