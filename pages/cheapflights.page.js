class CheapflightsPage {

    get logo() {
        return $('.mc6t-logo');
    }

    get signInButton() {
       return $('[role="button"][aria-label="Sign in"]');
    }

    async open() {
        await browser.url('/');
    }
}

export default new CheapflightsPage();