/* Covers c17608
Passes only if folder path > 5GB. Can do negative testing by specifying folder > 5GB.
Partial coverage, since we cannot capture commands run on powershell to download. */
import { expect } from '@playwright/test';
import { test } from '../utils/mainfixture';
import { mainutils } from '../utils/mainutils';
import { datadeliveryutils } from '../utils/datadeliveryutils';

//const folderPath = "Automation_OLC_West_Metro_3DEP_2019_034962/20200715/other";

test('download-AWS CLI', async ({ page, regularUserCredentials, dataDelivery }) => {

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

  //Validating with AWS CLI starts here

  //Call to select folders mentioned in fixture. Empty string indicates no file name is required.
  var pckgFile = await ddutilsObj.selectFolderforPckg(dataDelivery.awsCliPckg, "");
  //Bookmark is default option, change to AWS CLI
  await page.locator('div[role="combobox"]:has-text("Select download optionCyberduck (bookmark)") svg').click();
  await page.getByRole('option', { name: 'aws cli' }).click();

  //expect(await page.locator('._22aDX div:nth-child(3)').textContent()).toBe(fileSize);
  expect(await page.locator('.pb_browser_footer_main div:nth-child(3)').textContent()).toBe(pckgFile[0]);

  await page.locator('#root').getByText('Generate CLI Commands').click();
  await page.getByRole('heading', { name: 'AWS CLI' }).click();
  await page.getByText('Copy the commands below. Then, open Windows PowerShell, paste and run your comma').click();
  await page.locator('div[role="document"]:has-text("AWS CLICopy the commands below. Then, open Windows PowerShell, paste and run you") svg').nth(2).click();
  await page.getByRole('button', { name: 'Close' }).click();

  //Validating with AWS CLI ends here

  await page.getByTestId("logout").click();
  await expect(page).toHaveURL(`${regularUserCredentials.baseUrl}/authentication`);
  await page.close();

});