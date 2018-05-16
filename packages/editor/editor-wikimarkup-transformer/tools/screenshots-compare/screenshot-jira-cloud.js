const assert = require('assert');
const { existsSync } = require('fs');
const { Browser } = require('./browser');
const tasks = require(`${__dirname}/assets/adf.json`);

const TABS_COUNT = process.env.TABS_IN_PARALLEL || 1;
const JIRA_DESCRIPTION_SELECTOR = '.gmuKOB';

async function screenshot(browser, issueKey) {
  const screenshotFilePath = `${__dirname}/assets/${issueKey}-jira.png`;

  if (existsSync(screenshotFilePath)) {
    console.warn(`Screenshot ${screenshotFilePath} exists. Skip`);
    return;
  }

  const tab = await browser.getTab();
  const { id, pageObject } = tab;
  tab.log(`Got page object for ${issueKey}`);

  await pageObject.goto(
    `https://product-fabric.atlassian.net/browse/${issueKey}`,
    { waitUntil: 'networkidle0' },
  );
  if (!await tab.findPageSelectors([JIRA_DESCRIPTION_SELECTOR])) {
    tab.log(
      `Description element was not found on the page for issue ${issueKey}`,
    );
    tab.release();

    return;
  }

  tab.log(`Capture screenshot for ${issueKey}`);

  const rect = await pageObject.$eval(JIRA_DESCRIPTION_SELECTOR, element => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  });

  await pageObject.screenshot({
    path: screenshotFilePath,
    clip: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    },
  });

  tab.log('Release tab');
  tab.release();
}

async function main() {
  assert(
    process.env.TOKEN,
    'TOKEN environment variable is not specified. Use `cloud.session.token` cookie value for it',
  );

  const cookieExpiresAt = new Date();
  cookieExpiresAt.setMonth(cookieExpiresAt.getMonth() + 1);

  const browser = new Browser(TABS_COUNT, {
    viewport: { width: 1363, height: 1280 },
    cookies: [
      {
        name: 'cloud.session.token',
        value: process.env.TOKEN,
        domain: '.atlassian.net',
        path: '/',
        expires: Math.round(cookieExpiresAt.getTime() / 1000),
        httpOnly: true,
        secure: true,
      },
    ],
  });

  const ops = [];

  for (let key in tasks) {
    const screenshotOperation = screenshot(browser, key);
    ops.push(screenshotOperation);
  }

  await Promise.all(ops);
  browser.close();
}

process.on('unhandledRejection', reason => {
  console.error('Unhaldled promise rejection: %s', reason.stack);
  process.exit(1);
});

process.on('uncaughtException', err => {
  console.error('Uncaught exception: %s', err.message);
});

main();
