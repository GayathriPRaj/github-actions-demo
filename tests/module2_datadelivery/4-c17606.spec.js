//Traverse through folders and sub folders. Covers c17606
import { expect } from '@playwright/test';
import { test } from '../utils/mainfixture';
import { mainutils } from '../utils/mainutils';
import { datadeliveryutils } from '../utils/datadeliveryutils';

test('traverse through folders', async ({ page, regularUserCredentials, dataDelivery }) => {

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

  await page.click(':text-is("' + dataDelivery.prjFolder + '")');
  await page.getByRole('heading', { name: dataDelivery.prjFolder }).click();

  //open main folders
  await ddutilsObj.traverseFolders(dataDelivery.mainFolders);
  //opening subfolders level1 and verify checkbox left to it
  await ddutilsObj.traverseFolders(dataDelivery.subFoldersLevel1);
  //open subfolders level2 and verify checkbox left to it
  await ddutilsObj.traverseFolders(dataDelivery.subFoldersLevel2);

  //close subfolders level2 and verify checkbox left to it
  await ddutilsObj.traverseFolders(dataDelivery.subFoldersLevel2);
  //Close opened subfolders level1 and verify checkbox left to it
  await ddutilsObj.traverseFolders(dataDelivery.subFoldersLevel1);
  //close main folders and verify checkbox left to it
  await ddutilsObj.traverseFolders(dataDelivery.mainFolders);
  //check for files and verify no checkbox left to it
  await ddutilsObj.traverseFiles(dataDelivery.filesPath);

  await page.getByTestId("logout").click();
  await expect(page).toHaveURL(`${regularUserCredentials.baseUrl}/authentication`);
  await page.close();

});