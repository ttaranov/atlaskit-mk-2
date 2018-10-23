import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, comment, fullpage, editable } from '../_helpers';
import { messages } from '../../../plugins/text-formatting/ui/ToolbarAdvancedTextFormatting';

const more = `[aria-label="${messages.moreFormatting.defaultMessage}"]`;
const underline = `span=${messages.underline.defaultMessage}`;
const clear = `span=${messages.clearFormatting.defaultMessage}`;

// https://product-fabric.atlassian.net/browse/ED-4531
[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `toolbar-3.ts: should be able to select Clear Formatting on toolbar for ${
      editor.name
    } editor`,
    { skip: ['ie', 'safari'] },
    async client => {
      const browser = new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(more);
      await browser.click(more);
      await browser.waitForSelector(underline);
      await browser.click(underline);
      await browser.type(editable, 'test');
      await browser.click(more);
      await browser.click(clear);
      await browser.type(editable, 'cleared');
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
