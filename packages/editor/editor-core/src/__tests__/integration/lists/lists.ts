import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, fullpage, editable } from '../_helpers';

const PM_FOCUS_SELECTOR = '.ProseMirror-focused';

BrowserTestCase(
  `list: shouldn't change focus on tab if the list is not indentable`,
  { skip: ['ie', 'safari'] },
  async client => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    await page.type(editable, '* abc');
    await page.type(editable, 'Return');
    await page.type(editable, 'Tab');
    await page.type(editable, '123');
    await page.type(editable, 'Tab');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
    expect(await page.isExisting(PM_FOCUS_SELECTOR)).toBeTruthy();
  },
);
