import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { comment, fullpage, editable } from '../_helpers';
import { messages as blockTypeMessages } from '../../../plugins/block-type/ui/ToolbarBlockType';
import { messages } from '../../../plugins/block-type/types';

const changeFormatting = `[aria-label="${
  blockTypeMessages.textStyles.defaultMessage
}"]`;
const input = 'helloworld';

// https://product-fabric.atlassian.net/browse/ED-4531
[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `toolbar-2.ts: should be able to select heading1 for ${editor.name} editor`,
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
  const selector = 'span=' + messages['heading' + heading].defaultMessage;
  await browser.click(changeFormatting);
  await browser.waitForSelector(selector);
  await browser.click(selector);
  await browser.waitForSelector(`h${heading}`);
};
