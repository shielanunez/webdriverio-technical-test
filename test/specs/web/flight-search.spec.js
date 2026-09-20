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
            origin: 'Cebu',
            destination: 'Boracay',
            cabinClass: 'Economy',
            departureDate: dates.departure.calendar,
            returnDate: dates.return.calendar
        });
        const returnTripButton =
            await FlightSearchPage.getReturnTripButton();

        await FlightSearchPage.verifySearchDetails({
            origin: 'Cebu City',
            destination: 'Boracay',
            departureDate: dates.departure.header,
            returnDate: dates.return.header,
            cabinClass: 'Economy'
        });
    });
});