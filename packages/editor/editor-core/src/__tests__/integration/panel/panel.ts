import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';
// import {
//   clipboardHelper,
//   clipboardInput,
//   copyAsHTMLButton,
//   copyAsPlaintextButton,
// } from '../_helpers';

import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

BrowserTestCase(
  'Inserts a panel on fullpage',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);

    // await browser.waitForSelector(editable);
    // await browser.click(editable);
    await browser.waitForSelector(fullpage.placeholder);

    await browser.click(fullpage.placeholder);
    await quickInsert(browser, 'Panel');
    // type some text
    await browser.type(editable, 'this text should be in the panel');

    // expect(await browser.isVisible('.media-single')).toBe(true);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'Changes the type of a panel to Error',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);

    await browser.waitForSelector(fullpage.placeholder);
    await browser.click(fullpage.placeholder);

    await quickInsert(browser, 'Panel');

    // type some text
    await browser.type(editable, 'this text should be in the panel');

    // click on Error label
    const selector = `[aria-label="Error"]`;
    await browser.click(selector);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'Inserts a link into a panel by typing Markdown',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);

    await browser.waitForSelector(fullpage.placeholder);
    await browser.click(fullpage.placeholder);

    await quickInsert(browser, 'Panel');

    // type some text
    await browser.type(editable, '[Atlassian](https://www.atlassian.com/)');

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

// Cannot paste rich text in IE/Edge
// BrowserTestCase(
//   'Can paste rich text',
//   { skip: ['ie', 'safari', 'edge'] },
//   async client => {
//     const browser = new Page(client);
//     await browser.goto(clipboardHelper);
//     await browser.isVisible(clipboardInput);
//     await browser.type(
//       clipboardInput,
//       '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
//     );
//     await browser.click(copyAsHTMLButton);

//     const fullPageEditor = getExampleUrl('editor', 'editor-core', 'full-page');
//     await browser.goto(fullPageEditor);
//     await browser.waitFor(editable);

//     await browser.type(editable, '[] ');
//     await browser.waitForSelector('ol');

//     await browser.paste(editable);

//     const doc = await browser.$eval(editable, getDocFromElement);
//     expect(doc).toMatchDocSnapshot();
//   },
// );
