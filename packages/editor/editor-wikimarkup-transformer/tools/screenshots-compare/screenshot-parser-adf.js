const { existsSync } = require('fs');
const { Browser } = require('./browser');
const tasks = require(`${__dirname}/assets/adf.json`);

const TABS_COUNT = process.env.TABS_IN_PARALLEL || 1;
const ATLASKIT_EXAMPLE_URL =
  'http://ak-mk-2-prod.netlify.com/examples.html?groupId=editor&packageId=renderer&exampleId=basic';
const RENDERER_RESULT_SELECTOR = 'fieldset + div > div:nth-child(2)';

async function screenshot(browser, issueKey) {
  const screenshotFilePath = `${__dirname}/assets/${issueKey}-parser.png`;

  if (existsSync(screenshotFilePath)) {
    console.warn(`Screenshot ${screenshotFilePath} exists. Skip`);
    return;
  }

  const tab = await browser.getTab();
  tab.log(`Got page object for ${issueKey}`);

  if (await tab.findPageSelectors()) {
    tab.log(`Page selectors found for ${issueKey}`);
  } else {
    tab.reload();
    tab.log(`Page selectors found for ${issueKey}`);
  }

  const adf = tasks[issueKey];
  const { id, pageObject } = tab;

  // typing all serialized ADF in textarea is really slow
  tab.log('Clear textarea');
  await pageObject.$eval(
    'textarea',
    (element, adf) => (element.value = JSON.stringify(adf, null, 2)),
    adf,
  );
  await pageObject.type('textarea', ' ');

  tab.log(`Capture screenshot for ${issueKey}`);

  const rect = await pageObject.$eval(RENDERER_RESULT_SELECTOR, element => {
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
  const browser = new Browser(TABS_COUNT, {
    url: ATLASKIT_EXAMPLE_URL,
    selectors: ['textarea', RENDERER_RESULT_SELECTOR],
    viewport: { width: 697, height: 768 },
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
