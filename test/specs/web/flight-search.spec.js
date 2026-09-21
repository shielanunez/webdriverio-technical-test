import HomePage from "../../../pages/HomePage";
import FlightSearchPage from "../../../pages/FlightSearchPage";
import { getFlightDates } from "../../utils/date.utils";
import { searchErrorModalTitle, searchErrorMessages } from '../../data/search-error.data.js';
describe('Cheapflights - Search', () => {

    beforeEach(async () => {
        await HomePage.clearBrowserState();
        await HomePage.open();
        await HomePage.clearOrigin();
    });

    afterEach(async () => {
        await HomePage.clearBrowserState();
    });

    it('should search flights from Manila to Boracay', async () => {

        const dates = getFlightDates();

        await HomePage.searchFlights({
            origin: 'Manila',
            destination: 'Boracay',
            cabinClass: 'Economy',
            departureDate: dates.departure.calendar,
            returnDate: dates.return.calendar
        });

        console.log('URL:', await browser.getUrl());

        console.log(
            'Origin result elements:',
            await $$('[role="button"][aria-label^="Flight origin input"]').length
        );

        console.log(
            'Destination result elements:',
            await $$('[role="button"][aria-label^="Flight destination input"]').length
        );

        await FlightSearchPage.verifySearchDetails({
            origin: 'Manila',
            destination: 'Boracay',
            departureDate: dates.departure.header,
            returnDate: dates.return.header,
            cabinClass: 'Economy'
        });
        await FlightSearchPage.verifySearchResultsExist();
    });

    // it('should display an error when origin is not selected', async () => {
    //     const dates = getFlightDates();
    //     await HomePage.setDestination('Boracay');
    //     await HomePage.selectDepartureAndReturnDates(
    //         dates.departure.calendar,
    //         dates.return.calendar,
    //     );
    //     await HomePage.selectCabinClass('Economy');
    //     await HomePage.clickSearch();
    //     await HomePage.verifySearchErrorModal(
    //         searchErrorModalTitle
    //     );

    //     await HomePage.verifySearchErrorMessage(
    //         searchErrorMessages.missingOrigin
    //     );
    // });
});