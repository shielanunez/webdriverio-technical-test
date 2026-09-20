import HomePage from "../../../pages/HomePage";
import FlightSearchPage from "../../../pages/FlightSearchPage";
import { getFlightDates } from "../../utils/date.utils";

describe('Cheapflights - Search', () => {

    beforeEach(async () => {
        await HomePage.clearBrowserState();
        await HomePage.open();
        await HomePage.clearOrigin();
    });

    afterEach(async () => {
        await HomePage.clearBrowserState();
    });

    it('should search flights from Cebu to Boracay', async () => {

        const dates = getFlightDates();

        await HomePage.searchFlights({
            origin: 'Manila',
            destination: 'Boracay',
            cabinClass: 'Economy',
            departureDate: dates.departure.calendar,
            returnDate: dates.return.calendar
        });

        await FlightSearchPage.verifySearchDetails({
            origin: 'Manila',
            destination: 'Boracay',
            departureDate: dates.departure.header,
            returnDate: dates.return.header,
            cabinClass: 'Economy'
        });
        await FlightSearchPage.verifySearchResultsExist();
    });
});