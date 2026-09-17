import CheapflightsPage from '../../../pages/cheapflights.page.js';

describe('Cheapflights - Homepage', () => {

    beforeEach(async()=>{
        await CheapflightsPage.open();
    });

    it('should display the Cheapflights logo', async() =>{
        await expect(CheapflightsPage.logo).toBeDisplayed();
    });
    it('should display the Sign in button', async() =>{
        await expect(CheapflightsPage.signInButton).toBeDisplayed();
    });
    it('should display the Sign in button to the right of the logo', async()=>{
        const loginLocation = await CheapflightsPage.logo.getLocation();
        const signinLocation = await CheapflightsPage.signInButton.getLocation();
        expect (signinLocation.x).toBeGreaterThan(loginLocation.x);
    })

});