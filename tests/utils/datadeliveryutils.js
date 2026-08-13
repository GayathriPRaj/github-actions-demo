class datadeliveryutils {

    constructor(page, expect) {

        this.page = page;
        this.expect = expect;
    }

    //Check whether dates are in order of creation date. Young ones on top.
    compareDates(numRows, date) {

        var date1, date2, i, result;

        for (i = 0; i < (numRows - 1); i++) {
            date1 = new Date(date[i].trim()).getTime();
            date2 = new Date(date[i + 1].trim()).getTime();
            if (date1 >= date2)
                result = "PASS";
            else {
                result = "FAIL: Comparing " + date[i] + " with " + date[i + 1];
                break;
            }
        }
        return result;
    }

    //Gets date for each row and check the format.
    async checkDateFormat(numRows) {
        var fileName, fileDate, i, result;
        var dateformat = /(\d{2}):(\d{2})\s(AM|PM)\s(...)\s(\d{2})\s(\d{4})/
        for (i = 1; i <= numRows; i++) {
            fileName = await this.page.locator('.ant-table-tbody tr:nth-child(' + i + ') td:nth-child(1)').textContent();

            //if (fileName.includes('.zip')) {                
            fileDate = await this.page.locator('.ant-table-tbody tr:nth-child(' + i + ') td:nth-child(2)').textContent();

            if (fileDate.trim().match(dateformat))
                result = "PASS";
            else {
                result = "ERROR: Date format does not match " + fileDate;
                break;
            }
            /* }
            else {
                result = "ERROR: Zip Archive should have zip extension " + fileName;
                break;
            } */
        }
        return result;
    }

    //Gets modified data of all folders and checks the format.
    chkModifiedDtFormat(modififedDate) {
        var dateformat = /(\d{2}):(\d{2})\s(AM|PM)\s(...)\s(\d{2})\s(\d{4})/
        var result;
        for (var i = 0; i < modififedDate.length; i++) {
            if (modififedDate[i].trim().match(dateformat))
                result = "PASS";
            else {
                result = "ERROR: Date format does not match " + fileDate;
                break;
            }
        }
        return result;
    }

    //Returns download date as +24 hrs to the action triggered time.
    getDownloadDate() {
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var nextDay = new Date(Date.now() + (3600 * 1000 * 24));
        //console.log("nextDay is :" + nextDay);
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        //console.log("Timezone is :" + userTimezone);
        var strNextDay = nextDay.toLocaleString(undefined, { timeZone: userTimezone });

        var splitFullDate = strNextDay.split(",");
        var splitTime = splitFullDate[1].split(":");
        var hh = splitTime[0].trimStart();
        var mm = splitTime[1];
        var dd = nextDay.getDate();
        var mmm = month[nextDay.getMonth()];

        hh = parseInt(hh) < 10 ? "0" + hh : hh;
        mm = parseInt(mm) < 10 ? "0" + mm : mm;
        dd = parseInt(dd) < 10 ? "0" + dd : dd;

        strNextDay = hh + ":" + mm + " " + splitTime[2].slice(3, 5) + " " + mmm + " " + dd + " " + nextDay.getFullYear();
        return strNextDay;
    }

    //Checks for expires in value within 0 to 7 days range.
    validateExpiresIn(module, numRows, expiresIn) {
        var result = "PASS", i;

        for (i = 0; i < numRows; i++) {
            if (parseInt(expiresIn[i].slice(0, 1)) < 0 || parseInt(expiresIn[i].slice(0, 1)) > 7) {
                //result = "FAIL: Expires in should be withing 0 and 7. But row " + (i + 1) + " has " + expiresIn[i];
                result = `FAIL: Expires in for ${module} should be within 0 and 7. But row ${i + 1} has ${expiresIn[i]}`;
                //console.log("Inside fail :" + result);
            }
        }
        return result;
    }

    //Check folders under active deliveries are displayed in ascending order. 
    getSortDirection(arr) {
        const c = [];
        for (let i = 4; i < arr.length; i++) {
            c.push(arr[i - 1].localeCompare(arr[i]));
        }
        if (c.every((n) => n <= 0)) return 'Sorted';
        else return 'Unsorted';
    }

    //Gets file size of all folders and checks the format.
    checkFileSizeFormat(fileSize) {
        var result = "PASS";
        for (var i = 0; i < fileSize.length; i++) {

            var fsSplit = fileSize[i].split(" ");
            var size = Number(fsSplit[0].trim());

            if (!isNaN(size)) {
                //console.log("Filesize " + i + " " + fileSize[i]);
                if (!(fsSplit[1].trim().match(/^(K|M|G|T)B$/) || fsSplit[1].trim() == 'Bytes')) {
                    result = "ERROR: size is something else :" + fsSplit[1];
                    break;
                }
            }
            else {
                result = "ERROR: size is not a number :" + fsSplit[0];
                break;
            }
        }
        return result;
    }

    //Returns date or size of the folders.
    async openFoldersGetMetadata(prjFolder, mainFolders, modifier) {
        await this.page.click(`:text-is("${prjFolder}")`);
        await this.page.waitForTimeout(2000);
        //click main folder(s)
        for (var i = 0; i < mainFolders.length; i++) {

            await this.page.click(`:text-is("${mainFolders[i]}")`);
            await this.page.waitForTimeout(2000);
        }

        if (modifier === 'chkModifiedDtFormat') {
            var modififedDate = await this.page
                .locator('.ant-tree-title div div:nth-child(2) div:nth-child(1)').allTextContents();

            return modififedDate;
        }
        else if (modifier === 'checkFileSizeFormat') {
            var fileSize = await this.page
                .locator('.ant-tree-title div div:nth-child(2) div:nth-child(2)').allTextContents();
            return fileSize;
        }

    }

    //Selects folder to package and generates file name with prefix.
    async selectFolderforPckg(folderPath, fileNamePrefix) {
        var fileSize, pckgFileName;
        //var zipFileName = "TestZipAutomation" + (new Date().getTime().toString());        
        if (fileNamePrefix != "")
            pckgFileName = fileNamePrefix + (new Date().getTime().toString());
       // console.log("file name is " + pckgFileName);
        var folders = folderPath.split('/');
        for (var j = 0; j < folders.length; j++) {
            if (j == (folders.length) - 1) {
                //await page.locator(':text-is("' + folders[j] + '")').click();
                await this.page.locator('.ant-tree-checkbox:left-of(:text-is("' + folders[j] + '"))').first().click();
                fileSize = await this.page
                    .locator('.ant-tree-title div div:nth-child(2) div:nth-child(2):right-of(:text-is("' + folders[j] + '"))')
                    .first().textContent();
                //console.log("file size is :" + fileSize);
            }
            else {
                await this.page.locator(':text-is("' + folders[j] + '")').click();
            }
        }
        if (fileNamePrefix == "")
            return [fileSize];
        else
            return [pckgFileName, fileSize];
    }

    //Traverse through folders and verify checkbox appears and is editable
    async traverseFolders(folders) {
        for (var i = 0; i < folders.length; i++) {

            await this.page.locator(`:text-is("${folders[i]}")`).click();
            //await page.waitForTimeout(1000);
            await this.page.locator(`.ant-tree-checkbox:left-of(:text-is("${folders[i]}"))`).first().isEditable();
            await this.page.waitForTimeout(1000);
        }

    }

    //Opens the file path and verifies checkbox does not appear for files.
    async traverseFiles(filesPath) {
        var fileSplit = filesPath.split('/');

        for (var i = 0; i < fileSplit.length; i++) {
            if ((i + 1) < fileSplit.length) {
                await this.page.locator(':text-is("' + fileSplit[i] + '")').click();
                await this.page.waitForTimeout(1000);
            }
            else {
                var files = fileSplit[i].split(":");
                for (var j = 0; j < files.length; j++) {

                    await this.page.getByText(files[j]).click();
                    //Validating no checkboxes near files in 40 px range. From 70px chkbox for folder above the file is detected.
                    this.expect(await this.page.locator('.ant-tree-checkbox:near(:text-is("' + files[j] + '"),40)').count()).toEqual(0)
                }
            }
        }
    }

    


}
module.exports = { datadeliveryutils }