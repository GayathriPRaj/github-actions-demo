/*Coverage: c17595, c17596, c17597, c17598 and c17602 for zip Archive.
This file validates
- Presence of Zip Archive and Bulk Transfers under Exports.
- Checks for files sorted by created date.
- Checks created date format.
- Expires in column is 0 to 7 days.
- Download zip file and validate expire time.
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
});
test.afterAll(async ({ regularUserCredentials }) => {
    await page.getByTestId("logout").click();
    await expect(page).toHaveURL(`${regularUserCredentials.baseUrl}/authentication`);
    await page.close();
});

test('check for folders under exports - regular user', async ({}) => {
   
    await page.getByText('Exports').click();//minimize
    await page.getByText('Exports').click();//maximize
    await page.getByRole('treeitem', { name: '.zip Archive' }).click();//check zip archives appear
    await page.getByRole('treeitem', { name: 'Bulk Transfers' }).click();//check bulk transfers appear
});
test('check files under Zip Archives order by created date', async ({ }) => {

    await page.locator('span:has-text(".zip Archive")').first().click();
    await page.getByRole('heading', { name: '.zip Archive' }).click();
    await page.waitForTimeout(3000);
    //await page.getByRole('cell', { name: 'Created' }).locator('div:has-text("Created")').click();
    await page.getByRole('cell', { name: 'Created' }).getByText('Created', { exact: true }).click();


    const numRows = await page.locator('.ant-table-tbody tr').count();
    expect(numRows).toBeGreaterThan(0);
    //console.log("Total rows in Zip Archive: " + numRows);
    const date = await page.locator('.ant-table-tbody tr td:nth-child(2)').allTextContents();

    //Call function to check order of creation date. Young ones on top.
    expect(ddutilsObj.compareDates(numRows, date)).toBe('PASS');
});
test('zip archives-check file name has creation date format', async ({ }) => {

    const numRows = await page.locator('.ant-table-tbody tr').count();
    expect(numRows).toBeGreaterThan(0);
    //console.log("Total rows in Zip Archive: " + numRows);

    //To validate date format of all rows.
    var result = await ddutilsObj.checkDateFormat(numRows);
    expect(result).toBe('PASS');
});
test('Expires in column in zip Archives', async ({ }) => {
    var numRows, expiresIn;
    numRows = await page.locator('.ant-table-tbody tr').count();
    //console.log("rows in zip archive :" + numRows);
    expiresIn = await page.locator('.ant-table-tbody tr td:nth-child(3)').allTextContents();

    //expires in value within 0 to 7 days range in zip archive.
    expect(ddutilsObj.validateExpiresIn("Zip Archive", numRows, expiresIn)).toBe("PASS");
});
test('download from Zip Archives', async ({ }) => {
    const numRows = await page.locator('.ant-table-tbody tr').count();
    //console.log("rows in zip archive to download :" + numRows);
    expect(numRows).toBeGreaterThan(0);
    //Get download date which is +24 hours of the action time triggered.
    var strNextDay = ddutilsObj.getDownloadDate();
    var fileName = await page.locator('.ant-table-tbody tr:nth-child(1) td:nth-child(1)').textContent();
    await page.locator('.ant-table-tbody tr:nth-child(1) td:nth-child(5) svg').click();

    await page.getByText('Do you want to download this file?').click();

    //file name on download modal should be same as fileName
    await page.locator('p:has-text("' + fileName + '")').isVisible();

    //await page.getByText('Your secure download link will expire at 01:02 AM Dec 09 2022').click();
    await page.getByText('Your secure download link will expire at ' + strNextDay).isVisible();

    //clicked download, zip file is downloaded to user system.
    const [page1] = await Promise.all([
        page.waitForEvent('popup'),
        page.waitForEvent('download'),
        page.getByRole('button', { name: 'Download' }).click()
    ]);
});

