import { getFormattedDate } from '../test/utils/date.utils.js';

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
        return $('button[role="button"][aria-label="Search"]');
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
        return $('[role="combobox"][aria-label="Trip type"]');
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

    async selectDepartureAndReturnDates() {
        const departureDate = getFormattedDate(0);
        const returnDate = getFormattedDate(3);

        // Open calendar only if it isn't already open
        if (!(await this.departureCalendar.isDisplayed())) {
            await this.departureDateButton.click();
        }

        await this.selectDate(departureDate);
        await this.selectDate(returnDate);
    }

    async searchFlights(origin, destination, cabinClass) {
        await this.setOrigin(origin);
        await this.setDestination(destination);
        await this.selectDepartureAndReturnDates();
        await this.selectCabinClass(cabinClass);
        await this.searchButton.click();
    }

    async selectCabinClass(cabinClass) {
        const cabinOption = this.getCabinClassOption(cabinClass);
        await cabinOption.click();
        await expect(cabinOption).toHaveAttribute('aria-checked', 'true');
        // Close cabin class selector
        await this.tripTypeButton.click();
    }
}

export default new HomePage();