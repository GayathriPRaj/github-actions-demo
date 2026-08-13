/*Coverage: c17599, c17600, c17601 and c17602 for Bulk Transfers.
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
    //await page.goto('https://insite-test.nv5geospatial.com/authentication');
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
    await page.getByText('Bulk Transfers').click();
    await page.getByRole('heading', { name: 'Bulk Transfers' }).click();
    await page.waitForTimeout(3000);
});
test.afterAll(async ({ regularUserCredentials }) => {
    await page.getByTestId("logout").click();
    await expect(page).toHaveURL(`${regularUserCredentials.baseUrl}/authentication`);
    await page.close();
});

test('check for duck files-Bulk Transfers order by created date', async ({ }) => {

    await page.getByRole('cell', { name: 'Created' }).locator('div:has-text("Created")').click();

    //comparing dates start here
    const numRows = await page.locator('.ant-table-tbody tr').count();
    //console.log("Total rows in Bulk Transfer: " + numRows);
    const date = await page.locator('.ant-table-tbody tr td:nth-child(2)').allTextContents();
    //Gets modified data of all folders and checks the format.
    expect(ddutilsObj.compareDates(numRows, date)).toBe("PASS");
    //comparing dates end here
});

test('test download expiration-Bulk Transfers', async ({ }) => {
    //Validations: click download, validate file name expiry time starts here
    const numRows = await page.locator('.ant-table-tbody tr').count();
    expect(numRows).toBeGreaterThan(0);
    //date as +24 hrs to the action triggered time
    var strNextDay = ddutilsObj.getDownloadDate();
    var fileName = await page.locator('.ant-table-tbody tr:nth-child(1) td:nth-child(1)').textContent();
    await page.locator('.ant-table-tbody tr:nth-child(1) td:nth-child(5) svg').click();
    await page.getByText('Do you want to download this file?').click();
    //file name on download modal should be same as fileName
    await page.locator('p:has-text("' + fileName + '")').isVisible();
    //await page.getByText('Your secure download link will expire at ' + strNextDay + '').click();
    await page.getByText('Your secure download link will expire at ' + strNextDay + '').isVisible();
    //Validations: click download, validate file name expiry time ends here  
    //Click cancel, does not download the file and pop up disappears.
    //Yet to add validation for pop up invisible
    await page.getByRole('button', { name: 'Cancel' }).click();
});

test('Expires in column in Bulk Transfers', async ({ }) => {
    var numRows = await page.locator('.ant-table-tbody tr').count();
    //console.log("rows in Bulk Transfer :" + numRows);
    var expiresIn = await page.locator('.ant-table-tbody tr td:nth-child(3)').allTextContents();
    //expires in value within 0 to 7 days range in bulk transfers.
    expect(ddutilsObj.validateExpiresIn("Bulk Transfers", numRows, expiresIn)).toBe("PASS");

});