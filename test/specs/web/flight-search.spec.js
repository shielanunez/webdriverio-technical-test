import HomePage from "../../../pages/HomePage";

describe('Cheapflights - Search', () => {
    beforeEach(async () => {
        await HomePage.open();
        await HomePage.clearOrigin();


    })
    it('should search flights from Cebu to Boracay', async () => {
        await HomePage.searchFlights('Cebu', 'Boracay');
    })

})