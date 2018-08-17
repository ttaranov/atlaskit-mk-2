import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, comment, fullpage, editable } from '../_helpers';
import { messages } from '@atlaskit/editor-common';

const input = 'helloworld ';
// https://product-fabric.atlassian.net/browse/ED-4531
[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `Toolbar: should be able to select normal text, bold, italics, underline style for ${
      editor.name
    } editor`,
    { skip: ['ie', 'safari', 'edge'] },
    async client => {
      const browser = await new Page(client);
      const bold = `[aria-label="${messages.bold.defaultMessage}"]`;
      const italic = `[aria-label="${messages.italic.defaultMessage}"]`;
      const changeFormatting = `[aria-label="${
        messages.text_styles.defaultMessage
      }"]`;
      const normalText = `span=${messages.normal.defaultMessage}`;
      const more = `[aria-label="${messages.more_formatting.defaultMessage}"]`;
      const underline = `span=${messages.underline.defaultMessage}`;

      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.type(editable, input);
      await browser.click(changeFormatting);
      await browser.click(normalText);
      await browser.waitForSelector(bold);
      await browser.click(bold);
      await browser.type(editable, input);
      await browser.waitForSelector('strong');
      await browser.click(bold);

      await browser.click(italic);
      await browser.type(editable, input);
      await browser.waitForSelector('em');
      await browser.click(italic);

      await browser.waitForSelector(more);
      await browser.click(more);
      await browser.waitForSelector(underline);
      await browser.click(underline);
      await browser.type(editable, input);
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
