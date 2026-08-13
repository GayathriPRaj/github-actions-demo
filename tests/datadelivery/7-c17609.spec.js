/* Covers 7-c17609
Logic for cyberduck packaging only single folder. Had to implement async function 
Passes only if folder path > 5GB.*/

import { expect } from '@playwright/test';
import { test } from '../utils/mainfixture';
import { mainutils } from '../utils/mainutils';
import { datadeliveryutils } from '../utils/datadeliveryutils';

test('download-cyberduck bookmark', async ({ page, regularUserCredentials, dataDelivery }) => {

  var mainutilsObj = new mainutils(page);
  var ddutilsObj = new datadeliveryutils(page, expect);

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

  //Validation starts here
  //Call to select folders mentioned in fixture. Pass prefix for package file name as an argument.
  var pckgFile = await ddutilsObj.selectFolderforPckg(dataDelivery.cyberduckPckg, "TestBkmarkAutomation");

  await page.locator('div[role="combobox"]:has-text("Select download optionCyberduck (bookmark)") svg').click();
  await page.getByRole('option', { name: 'Cyberduck (bookmark)' }).click();

  //Expects size in package tray to be same as folder size.
  expect(await page.locator('.pb_browser_footer_main div:nth-child(3)').textContent()).toBe(pckgFile[1]);
  await page.getByPlaceholder('Enter bookmark name').fill(pckgFile[0]);
  await page.locator('#root').getByText('Begin Download').click();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    //page.locator('#root').getByText('Begin Download').click()
  ]);

  await page.getByText('Bulk Transfers').click();
  await page.getByRole('heading', { name: 'Bulk Transfers' }).click();
  //Expects package file name in bulk transfers.
  expect(await page.locator('.ant-table-tbody tr:nth-child(1) td:nth-child(1)').textContent())
    .toContain(pckgFile[0]);

  //Validation ends here

  await page.getByTestId("logout").click();
  await expect(page).toHaveURL(`${regularUserCredentials.baseUrl}/authentication`);
  await page.close();

});