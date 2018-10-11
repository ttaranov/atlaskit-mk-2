import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  clipboardHelper,
  clipboardInput,
  copyAsHTMLButton,
  copyAsPlaintextButton,
  insertMentionUsingClick,
} from '../_helpers';
import {
  messageEditor,
  editable,
  loadActionButton,
} from './_task-decision-helpers';

/* 
 * Safari adds special characters that end up in the snapshot
*/

// Cannot paste rich text in IE/Edge
BrowserTestCase(
  'task-decision-2.ts: can paste rich text into an action',
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

    await browser.goto(messageEditor);
    await browser.waitFor(editable);
    await browser.type(editable, '[] ');
    await browser.waitForSelector('ol');
    await browser.paste(editable);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'task-decision-2.ts: can paste plain text into an action',
  { skip: ['ie', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(clipboardHelper);
    await browser.isVisible(clipboardInput);
    await browser.type(
      clipboardInput,
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*',
    );
    await browser.click(copyAsPlaintextButton);
    await browser.goto(messageEditor);
    await browser.waitFor(editable);
    await browser.type(editable, '[] ');
    await browser.waitForSelector('ol');
    await browser.paste(editable);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

// Safari highlights entire text on clic
// IE is generally flaky
BrowserTestCase(
  'task-decision-2.ts: can edit an action',
  { skip: ['ie', 'safari', 'edge'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.click(loadActionButton);
    await browser.waitForSelector('ol span + div');
    await browser.click('ol span + div');
    await browser.type(editable, ' has been edited');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'task-decision-2.ts: can insert mention into an action using click',
  { skip: ['ie', 'safari'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.waitFor(editable);
    await browser.type(editable, '[] ');
    await browser.waitForSelector('ol');
    await insertMentionUsingClick(browser, '0');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
