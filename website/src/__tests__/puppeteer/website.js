// @flow
const puppeteer = require('puppeteer');

const coreUrls = require('../integration/utils/global').getUrls(
  'core',
  require('../integration/utils/global.js').components,
);

let page;
let browser;

const app = '#app';
const title = 'h1';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

// It looks like the issue is coming when we do randomn navigation
let shuffled = coreUrls
  .map(a => ({ sort: Math.random(), value: a }))
  .sort((a, b) => a.sort - b.sort)
  .map(a => a.value);

describe('AK-5479 - Script', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 150, // slow down by 150ms
      args: ['--start-fullscreen'],
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1040 });
  });
  afterAll(async () => {
    await browser.close();
  });

  it('The page does not display error logs', async () => {
    for (const componentUrl of shuffled) {
      console.log(`Navigate to ${componentUrl}`);
      page.on('console', msg => {
        for (let i = 0; i < msg.args().length; ++i)
          console.log(`${i}: ${msg.args()[i]}`);
      });
      await page.goto(componentUrl);
      await page.waitForSelector(app);
      const element = await page.$(title);
      const pageTitle = await page.evaluate(
        element => element.textContent,
        element,
      );
      expect(pageTitle).not.toBe('Oops!');
    }
  });
});
