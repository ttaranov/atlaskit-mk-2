import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { comment, fullpage, editable } from '../_helpers';

const changeFormatting = '[aria-label="Change formatting"]';
const input = 'helloworld';

// https://product-fabric.atlassian.net/browse/ED-4531
[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `Toolbar: should be able to select heading1 for ${editor.name} editor`,
    { skip: ['ie', 'safari'] },
    async client => {
      const browser = new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(changeFormatting);
      await browser.type(editable, input);
      for (let i = 1; i <= 6; i++) {
        await validateFormat(browser, i);
      }
    },
  );
});

const validateFormat = async (browser, heading) => {
  await browser.click(changeFormatting);
  await browser.waitForSelector(`span=Heading ${heading}`);
  await browser.click(`span=Heading ${heading}`);
  await browser.waitForSelector(`h${heading}`);
};
