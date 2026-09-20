import { switchToNewWindow } from '../test/utils/browser.utils.js';

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
    get returnDateButton() {
        return $('[role="button"][aria-label="Return date"]');
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

    async clearBrowserState() {
        try {
            await browser.deleteAllCookies();

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
        await this.selectLocation(originInputField, value);
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
    }

    async selectToday() {
        await this.departureDateButton.click();
        await this.todayDate.click();
    }

    async selectDate(date) {
        await this.getDateButton(date).click();
    }

    async selectDepartureAndReturnDates(departureDate, returnDate) {
        // Open calendar only if it isn't already open
        if (!(await this.departureCalendar.isDisplayed())) {
            await this.departureDateButton.click();
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
        await this.setOrigin(origin);
        await this.setDestination(destination);
        await this.selectDepartureAndReturnDates(
            departureDate,
            returnDate
        );

        await browser.pause(1000);

        await this.selectCabinClass(cabinClass);
        const originalWindow = await browser.getWindowHandle();
        await this.searchButton.click();

        return await switchToNewWindow(originalWindow);
       
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
}

export default new HomePage();