/*Coverage: c17603, c17604, c17605 for Active Deliveries.
This file validates
- Project folders sort order.
- Modified date of folders and sub folders.
- Size of files in format.
*/
import { expect } from '@playwright/test';
import { test } from '../utils/mainfixture';
import { mainutils } from '../utils/mainutils';
import { datadeliveryutils } from '../utils/datadeliveryutils';

//const {test} = require('../utils/test-base');
var mainutilsObj, ddutilsObj;
let page;

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

test('check folders-Active Deliveries', async ({ }) => {

    await page.getByText('Active Deliveries').click();//minimize
    await page.getByText('Active Deliveries').click();//maximize

    //check project folder sort order starts here
    var projectFolders = await page.getByRole('treeitem').allTextContents();
    //Verify project folders are sorted.
    expect(ddutilsObj.getSortDirection(projectFolders)).toBe('Sorted');
});

test('check modified date format', async ({dataDelivery}) => {

    //Open specified folders and get modified dates of all folders
    var modififedDate = await ddutilsObj.openFoldersGetMetadata(dataDelivery.prjFolder, dataDelivery.mainFolders, "chkModifiedDtFormat");
    //Check modified date in specified format.
    expect(ddutilsObj.chkModifiedDtFormat(modififedDate)).toBe('PASS');
});

test('check for file size-Active Deliveries', async ({dataDelivery }) => {

    //Open specified folders and get file size for all folders
    var fileSize = await ddutilsObj.openFoldersGetMetadata(dataDelivery.prjFolder, dataDelivery.mainFolders, "checkFileSizeFormat");
    //Validate file size in specified format.
    expect(ddutilsObj.checkFileSizeFormat(fileSize)).toBe('PASS');
});