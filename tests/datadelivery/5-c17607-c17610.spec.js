/*Sees default option is zip and packages a zip file.
Coverage: c17607 and c17610 */

import { expect } from '@playwright/test';
import { test } from '../utils/mainfixture';
import { mainutils } from '../utils/mainutils';
import { datadeliveryutils } from '../utils/datadeliveryutils';

test('package zip file', async ({ page, regularUserCredentials, dataDelivery }) => {

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

  var pckgFile = await ddutilsObj.selectFolderforPckg(dataDelivery.zipFilePckg, "TestZipAutomation");

  await page.getByText('Select download optionzip').isDisabled();
  //expect(await page.locator('.pb_browser_footer_main div:nth-child(3)').textContent()).toBe(fileSize);
  expect(await page.locator('.pb_browser_footer_main div:nth-child(3)').textContent()).toBe(pckgFile[1]);
  await page.getByPlaceholder('Enter your archive name here').fill(pckgFile[0]);
  await page.locator('#root').getByText('Begin Download').click();
  await page.waitForTimeout(2000);

  await page.getByText('.zip Archive').click();
  await page.waitForTimeout(2000);

  //click the top file name and validate with the name we entered.
  expect(await page.locator('.ant-table-tbody tr:nth-child(1) td:nth-child(1)').textContent())
    .toContain(pckgFile[0] + ".zip");

  //Zip file packaging customization ends here  

  await page.getByTestId("logout").click();
  await expect(page).toHaveURL(`${regularUserCredentials.baseUrl}/authentication`);
  await page.close();

});