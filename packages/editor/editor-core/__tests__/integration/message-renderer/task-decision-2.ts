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
  loadActionButton,
} from './_task-decision-helpers';

/*
 * Safari adds special characters that end up in the snapshot 
*/

// Cannot paste rich text in IE/Edge
BrowserTestCase(
  'task-decision: can paste rich text into a action',
  { skip: ['ie', 'safari', 'edge'] },
  async client => {
    const browser = await new Page(client);
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
  'task-decision: can paste plain text into a action',
  { skip: ['safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(clipboardHelper);
    await browser.isVisible(clipboardInput);
    await browser.type(
      clipboardInput,
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
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

// Safari adds special characters to the snapshot
BrowserTestCase(
  'task-decision: can edit an action',
  { skip: ['safari'] },
  async client => {
    const browser = await new Page(client);
    await browser.goto(messageEditor);
    await browser.click(loadActionButton);
    await browser.waitForSelector('ol');

    await browser.type(editable, 'Enter');
    await browser.type(editable, 'We have edited ');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
