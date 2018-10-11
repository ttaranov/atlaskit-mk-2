import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';

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
