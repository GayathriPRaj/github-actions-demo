# insite-e2e-tests

This repo has end-to-end tests for Data Delivery. These tests are written using Playwright. 

Playwright, by Microsoft, is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API. 

## Pre-requisite

- At least two entries in Zip Archive and Bulk Transfers.
- At least two project folders under Active Deliveries.
- No zip package in progress under Zip Archive.

## Limitations

- Manual intervention is required to compare packaged folder contents with that on the page.
- Downloaded file to the system through automation cannot be viewed. 
- Download implemented for single folder due to mismatch in size calculations. (Dev code calculates from S3, tests calculate from FE.)
- AWS CLI: Validating if commands are generated and copy to clipboard. Manual intervention is required to check the download.
 

## License
Licensed under the [Copyright © 2022 NV5 Global, Inc - All Rights Reserved.](LICENSE)
