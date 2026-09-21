import { switchToNewWindow } from '../test/utils/browser.utils.js';
import { expect as chaiExpect } from 'chai';

class HomePage {

    get logo() {
        return $('.mc6t-logo');
    }

    get signInButton() {
        return $('[role="button"][aria-label="Sign in"]');
    }
    get originInput() {
        return $('input[role="combobox"][aria-label="Origin location"]');
    }

    get selectedOrigin() {
        return $('input[data-test-origin]').parentElement().$(
            '[role="listitem"]'
        );
    }
    get removeOriginButton() {
        return $('input[data-test-origin]').parentElement().$(
            '[role="button"][aria-label="Remove value"]'
        );
    }

    get destinationInput() {
        return $('input[data-test-destination]')
    }

    get searchButton() {
        return $('[role="button"][aria-label="Search"]');
    }

    get departureDateButton() {
        return $('[role="button"][aria-label="Departure date"]');
    }

    get departureReturnButton() {
        return $('//div[@role="button"][normalize-space()="Departure - Return"]')
    }
    get returnDateButton() {
        return $('[role="button"][aria-label="Return date"]');
    }

    get flightDateButton() {
        return $('//span[text()="Departure"]');
    }
    getDateButton(date) {
        return $(`div[role="button"][aria-label*="${date}"]`);
    }

    get todayDate() {
        return $('[role="gridcell"][aria-current="true"] [role="button"]');
    }

    returnDateButton(date) {
        return $(`div[role="button"][aria-label*="${date}"]`);
    }

    get departureCalendar() {
        return $('[aria-label="Departure date"].OV9e-cal-wrapper');
    }

    getCabinClassOption(cabinClass) {
        return $(`label[role="radio"][aria-label="${cabinClass}"]`);
    }

    get tripTypeButton() {
        return $('div[role="combobox"][aria-label="Trip type"]');
    }

    get searchErrorTitle() {
        return $('.GRvf-title');
    }

    get searchErrorMessages() {
        return $$('[role="alert"]');
    }

    get dismissButton() {
        return $('button=Dismiss');
    }

    get airportSelectionError() {
        return $('.TaO3-title');
    }
    async clearBrowserState() {
        try {
            await browser.deleteCookies();

            await browser.execute(() => {
                localStorage.clear();
                sessionStorage.clear();
            });
        } catch (error) {
            console.warn('Browser cleanup failed:', error.message);
        }
    }
    async open() {
        await browser.url('/');
    }

    async clearOrigin() {
        if (await this.removeOriginButton.isExisting()) {
            await this.removeOriginButton.click();
        }
    }

    async setOrigin(value) {
        const originInputField = this.originInput;
        const currentValue = await originInputField.getValue();

        if (currentValue !== value) {
            await this.clearOrigin();
            await this.selectLocation(originInputField, value);
        }
    }

    async setDestination(value) {
        const destinationInputField = this.destinationInput;
        await this.selectLocation(destinationInputField, value);
    }


    async selectLocation(inputField, value) {
        await inputField.setValue(value);
        await browser.pause(1000);
        await browser.keys("ArrowDown");
        await browser.pause(1000);
        //Select the first item
        await browser.keys("Enter");
        await browser.keys("Escape");
    }

    async selectToday() {
        await this.departureDateButton.click();
        await this.todayDate.click();
    }

    async selectDate(date) {
        await this.getDateButton(date).click();
    }

    async selectDepartureAndReturnDates(departureDate, returnDate) {
        const departureSpan = await $('//span[@class="bCht-placeholder" and text()="Departure"]');

        if (!(await this.departureCalendar.isDisplayed())) {
            await this.flightDateButton.click();
        }

        await this.selectDate(departureDate);
        await this.selectDate(returnDate);
    }

    async searchFlights({
        origin,
        destination,
        cabinClass,
        departureDate,
        returnDate
    }) {
        if (origin) {
            await this.setOrigin(origin);
        }

        if (destination) {
            await this.setDestination(destination);
        }

        if (departureDate && returnDate) {
            await this.selectDepartureAndReturnDates(
                departureDate,
                returnDate
            );
        }

        if (cabinClass) {
            await this.selectCabinClass(cabinClass);
        }

        await this.searchButton.click();
    }

    async selectCabinClass(cabinClass) {
        const cabinOption = this.getCabinClassOption(cabinClass);

        const isSelected =
            await cabinOption.getAttribute('aria-checked') === 'true';

        if (!isSelected) {
            await cabinOption.click();

            await expect(cabinOption).toHaveAttribute(
                'aria-checked',
                'true'
            );
        }

        // Close the cabin/traveler selector
        await this.tripTypeButton.click();

        await expect(this.tripTypeButton).toHaveAttribute(
            'aria-expanded',
            'false'
        );
    }

    async closeDepartureCalendar() {
        if (await this.departureCalendar.isDisplayed()) {
            await browser.keys('Escape');

            await browser.waitUntil(
                async () => !(await this.departureCalendar.isDisplayed()),
                {
                    timeout: 5000,
                    timeoutMsg: 'Departure calendar did not close'
                }
            );
        }
    }

    async clickSearch() {
        await this.searchButton.click();
    }

    async verifySearchErrorModal(title) {
        await expect(this.searchErrorTitle).toHaveText(title);
        await expect(this.dismissButton).toBeDisplayed();
    }

    async verifySearchErrorMessages(messages) {
        try {
            await browser.waitUntil(
                async () => (await $$('[role="alert"]')).length > 0,
                {
                    timeout: 5000,
                    interval: 500
                }
            );
        } catch (error) {
            console.warn(

                '⚠ Search validation dialog did not display.'
            );
            throw error;
        }

        const actualMessages = [];

        for (const element of await $$('[role="alert"]')) {
            actualMessages.push(await element.getText());
        }

        for (const message of messages) {
            chaiExpect(actualMessages).to.include(message);
        }
    }

    async switchToSearchResults(originalWindow) {
        await switchToNewWindow(originalWindow);
    }

    async verifyAirportSelectionErrorSoft(expectedMessage) {
        try {
            await expect(this.airportSelectionError)
                .toHaveText(expectedMessage);

            console.log(`✓ Dialog displayed: "${expectedMessage}"`);
        } catch (error) {
            console.warn(
                `⚠ Expected dialog did not display: "${expectedMessage}"`
            );
        }
    }


}

export default new HomePage();