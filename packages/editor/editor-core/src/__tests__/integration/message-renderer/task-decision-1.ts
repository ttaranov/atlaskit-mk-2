import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  clipboardHelper,
  clipboardInput,
  copyAsHTMLButton,
  copyAsPlaintextButton,
} from '../_helpers';
import {
  messageEditor,
  editable,
  loadDecisionButton,
} from './_task-decision-helpers';

/*
 * Safari adds special characters that end up in the snapshot
*/

// Cannot paste rich text in IE/Edge
BrowserTestCase(
  'task-decision-1.ts: can paste rich text into a decision',
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
    await browser.type(editable, '<> ');
    await browser.waitForSelector('ol');
    await browser.paste(editable);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

BrowserTestCase(
  'task-decision-1.ts: can paste plain text into a decision',
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
    await browser.type(editable, '<> ');
    await browser.waitForSelector('ol');
    await browser.paste(editable);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);

// Safari highlights entire text on click
// IE is generally flaky
BrowserTestCase(
  'task-decision-1.ts: can edit a decision',
  { skip: ['ie', 'safari', 'edge'] },
  async client => {
    const browser = new Page(client);
    await browser.goto(messageEditor);
    await browser.click(loadDecisionButton);
    await browser.waitForSelector('ol span + div');
    await browser.click('ol span + div');
    await browser.type(editable, ' has been edited');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
