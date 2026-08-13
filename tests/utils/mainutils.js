class mainutils {

    constructor(page) {

        this.page = page;
    }

    async userLogin(userEmailId, password) {
        //console.log("INSIDE USER LOGIN FUNCTION");
        //await this.page.goto("https://insite-test.nv5geospatial.com/authentication");
        await this.page.getByLabel("Email *").click();
        await this.page.getByLabel("Email *").fill(`${userEmailId}`);
        await this.page.getByRole("button", { name: "Login" }).click();
        await this.page.click('#password');
        await this.page.locator('#password').fill(`${password}`);
        await this.page.getByRole("button", { name: "Login" }).click();
    }


    /* async switchUserGroup(clientAlias, userGrp) {
        console.log("INSIDE SWITCH USER GROUP");
        await this.page.locator('#switch-group-menu-button').click();
        await this.page.getByText('Switch User Group').click();
        await this.page.getByText('Select a new user group to reload data.').click();
        await this.page.locator('div[role="combobox"]:has-text("Select a user group") div').first().click();
        await this.page.getByRole('option', { name: `${clientAlias} - ${userGrp}` }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
    } */
    async switchUserGroup(clientAlias, userGrp) {
        //console.log("INSIDE SWITCH USER GROUP");
        await this.page.getByTestId('main-header').getByTestId('input').click();
        await this.page.getByText(`${userGrp}`).click();
    }

    async selectClient(reqClient) {
        var defaultClient = await this.page.locator("#client-selection-dropdown").inputValue();
        //console.log(`Default client is :${defaultClient} AND required client is :${reqClient}`)
        if (defaultClient != reqClient) {
            await this.page.getByPlaceholder("Type to search...").click();
            await this.page.getByRole('option', { name: `${reqClient}` }).click();
        }
    }

}
module.exports = { mainutils };