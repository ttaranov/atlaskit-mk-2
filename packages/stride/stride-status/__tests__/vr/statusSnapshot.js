// @flow
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

const puppeteer = require('puppeteer');

const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });
const customConfig = { threshold: 0.1 };
const urlStatus = getExampleUrl('stride', 'stride-status', 'basic');
const statusDropdown = '#examples [role="button"]';
const statusDropdownMenu = '[data-role="droplistContent"]';

const timeout = 60000;
let browser;
let page;

describe('Snapshot Test', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      // run test in headless mode
      headless: true,
      slowMo: 100,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    await page.goto(urlStatus);
    await page.waitForSelector(statusDropdown);
    await page.click(statusDropdown);
    await page.waitForSelector(statusDropdownMenu);
  }, timeout);

  afterAll(async () => {
    await browser.close();
  });

  it('should match the prod stride', async () => {
    const image = await page.screenshot();
    //$FlowFixMe
    expect(image).toMatchImageSnapshot({
      customDiffConfig: customConfig,
      customSnapshotIdentifier: 'stride-status',
      noColors: true,
    });
  });
});
