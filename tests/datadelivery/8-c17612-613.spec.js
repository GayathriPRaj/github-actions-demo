/*Coverage: c6266, c6267, c6268 and c6273 for Bulk Transfers.
This file validates
- Checks for files sorted by created date in Bulk Transfers.
- Click download duck file validate expire time and cancel download.
*/
import { expect } from '@playwright/test';
import { test } from '../utils/mainfixture';
import { mainutils } from '../utils/mainutils';
import { datadeliveryutils } from '../utils/datadeliveryutils';

//const {test} = require('../utils/test-base');
var mainutilsObj, ddutilsObj;
let page;
test.describe.configure({ mode: "serial" })
test.beforeAll(async ({ browser, regularUserCredentials }) => {

    page = await browser.newPage();
    mainutilsObj = new mainutils(page);
    ddutilsObj = new datadeliveryutils(page, expect);
    await page.goto(`${regularUserCredentials.baseUrl}/authentication`);
    await mainutilsObj.userLogin(regularUserCredentials.userEmailId, regularUserCredentials.password);
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(`${regularUserCredentials.baseUrl}/${regularUserCredentials.clientAlias}/${regularUserCredentials.clientAlias}-${(regularUserCredentials.userGroup.replaceAll(" ", "-")).toLowerCase()}/search`);
    await page.getByTestId('main-header').getByText('Data Delivery').click();
    await expect(page).toHaveURL(`${regularUserCredentials.baseUrl}/${regularUserCredentials.clientAlias}/${regularUserCredentials.clientAlias}-${(regularUserCredentials.userGroup.replaceAll(" ", "-")).toLowerCase()}/data-delivery`);
    await page.getByText(`${regularUserCredentials.client}`).click();
    await page.getByText('Data Delivery').nth(1).click();

});
test.afterAll(async ({ regularUserCredentials }) => {
    await page.getByTestId("logout").click();
    await expect(page).toHaveURL(`${regularUserCredentials.baseUrl}/authentication`);
    await page.close();
});

test('check Data Delivery Help', async ({ }) => {

    //await page.locator('._oeer3').first().click();
    await page.getByTestId("help-icon").click();
    //await page.locator('.pb_side_bar_top_keys_icons_div svg:nth-child(1)').click();

    await page.getByRole('heading', { name: 'Data Delivery Help' }).click();
    await page.getByRole('heading', { name: 'Downloading a Delivery' }).click();
    await page.getByRole('heading', { name: 'Delivery Expiration' }).click();
    await page.getByRole('heading', { name: 'Delivery Restoration' }).click();

    //Validate: contact form url
    const [page1] = await Promise.all([
        page.waitForEvent('popup'),
        page.getByText('contact form').click()
    ]);

    //Validate: More Information url
    const [page2] = await Promise.all([
        page.waitForEvent('popup'),
        page.getByRole('button', { name: 'More Information' }).click()
    ]);

    await page.getByRole('button', { name: 'Close' }).click();
});

test('Generate security keys', async ({ }) => {

    await page.getByTestId("key-icon").click();
    //Check below fields are blank
    expect(await page.locator('input.ant-input').first().inputValue()).toBe("");
    expect(await page.locator('input.ant-input').nth(1).inputValue()).toBe("");
    expect(await page.locator('input.ant-input').nth(2).inputValue()).toBe("");
    await page.getByRole('button', { name: 'Download as .csv' }).isDisabled();

    await page.getByRole('button', { name: 'Get Key Pair' }).click();
    await page.waitForTimeout(3000);

    //Check below fields has some text
    expect(await page.locator('input.ant-input').first().inputValue()).not.toBe("");
    expect(await page.locator('input.ant-input').nth(1).inputValue()).not.toBe("");
    expect(await page.locator('input.ant-input').nth(2).inputValue()).not.toBe("");

    await page.getByRole('button', { name: 'Download as .csv' }).isEnabled();

    await page.getByRole('button', { name: 'Close' }).click();
});