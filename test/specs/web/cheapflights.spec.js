import HomePage from '../../../pages/HomePage.js';

describe('Cheapflights - Homepage', () => {

    beforeEach(async()=>{
        await HomePage.open();
    });

    it('should display the Cheapflights logo', async() =>{
        await expect(HomePage.logo).toBeDisplayed();
    });
    it('should display the Sign in button', async() =>{
        await expect(HomePage.signInButton).toBeDisplayed();
    });
    it('should display the Sign in button to the right of the logo', async()=>{
        const loginLocation = await HomePage.logo.getLocation();
        const signinLocation = await HomePage.signInButton.getLocation();
        expect (signinLocation.x).toBeGreaterThan(loginLocation.x);
    })

});