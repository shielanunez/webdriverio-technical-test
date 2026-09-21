import HomePage from '../../../pages/HomePage';
import FlightSearchPage from '../../../pages/FlightSearchPage';
import { getFlightDates } from '../../utils/date.utils';
import { flightSearchData } from '../../data/flight-search.data';
import { searchErrorMessages } from '../../data/search-error.data.js';
import { switchToNewWindow } from '../../utils/browser.utils.js';

describe('Cheapflights - Search', () => {

    beforeEach(async () => {
        await HomePage.clearBrowserState();
        await HomePage.open();
    });

    afterEach(async () => {
        await HomePage.clearBrowserState();
    });

    it('should search flights from Manila to Boracay', async () => {
        const dates = getFlightDates();
        const originalWindow = await browser.getWindowHandle();

        await HomePage.searchFlights({
            ...flightSearchData.valid,
            departureDate: dates.departure.calendar,
            returnDate: dates.return.calendar
        });

        await switchToNewWindow(originalWindow);

        await FlightSearchPage.verifySearchDetails({
            ...flightSearchData.valid,
            departureDate: dates.departure.header,
            returnDate: dates.return.header
        });

        await FlightSearchPage.verifySearchResultsExist();
    });

    it('should display an error message when no origin is selected', async () => {
        const dates = getFlightDates();

        await HomePage.clearOrigin();

        await HomePage.setDestination(
            flightSearchData.missingOrigin.destination
        );

        await HomePage.selectDepartureAndReturnDates(
            dates.departure.calendar,
            dates.return.calendar
        );

        await HomePage.selectCabinClass(
            flightSearchData.missingOrigin.cabinClass
        );

        await HomePage.clickSearch();

        await HomePage.verifySearchErrorMessages([
            searchErrorMessages.missingOrigin
        ]);
    });

    it('should display an error message when no destination is selected', async () => {
        const dates = getFlightDates();

        await HomePage.setOrigin(
            flightSearchData.missingDestination.origin
        );

        await HomePage.selectDepartureAndReturnDates(
            dates.departure.calendar,
            dates.return.calendar
        );

        await HomePage.selectCabinClass(
            flightSearchData.missingDestination.cabinClass
        );

        await HomePage.clickSearch();

        await expect.soft(HomePage.airportSelectionError)
            .toHaveText("You didn't select an airport");
    });
});