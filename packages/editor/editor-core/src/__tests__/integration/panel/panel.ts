import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';
import {
  clipboardHelper,
  clipboardInput,
  copyAsHTMLButton,
  copyAsPlaintextButton,
} from '../_helpers';
import { insertMentionUsingClick } from '../message-renderer/_mention-helpers';

BrowserTestCase(
  'Inserts a panel on fullpage',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    // type some text
    await browser.type(editable, 'this text should be in the panel');

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
BrowserTestCase(
  'Can paste rich text',
  { skip: ['ie', 'safari', 'edge'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(clipboardHelper);
    await browser.isVisible(clipboardInput);
    await browser.type(
      clipboardInput,
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
    );
    await browser.click(copyAsHTMLButton);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    await browser.paste(editable);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'can paste plain text',
  { skip: ['ie', 'safari', 'edge'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(clipboardHelper);
    await browser.isVisible(clipboardInput);
    await browser.type(
      clipboardInput,
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*',
    );
    await browser.click(copyAsPlaintextButton);

    await browser.goto(fullpage.path);
    await browser.waitForSelector(editable);

    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    await browser.paste(editable);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'can insert mention into panel using click',
  { skip: ['ie', 'safari', 'edge'] },
  async client => {
    const browser = new Page(client);

    await browser.goto(fullpage.path);
    await browser.waitFor(editable);
    await browser.click(editable);
    await quickInsert(browser, 'Panel');

    await insertMentionUsingClick(browser, '0');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
