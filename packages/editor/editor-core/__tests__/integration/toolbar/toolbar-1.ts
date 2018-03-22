import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, editors, editable } from '../_helpers';

const changeFormatting = '[aria-label="Change formatting"]';
const normalText = 'span=Normal text';

const input = 'helloworld';
editors.forEach(editor => {
  BrowserTestCase(
    `Toolbar: should be able to select normal text style for ${
      editor.name
    } editor`,
    async client => {
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.type(editable, input);
      await browser.click(changeFormatting);
      await browser.click(normalText);
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `Toolbar: should be able to select Bold on toolbar for ${
      editor.name
    } editor`,
    async client => {
      const bold = '[aria-label="Bold"]';
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(bold);
      await browser.click(bold);
      await browser.type(editable, input);
      await browser.waitForSelector('strong');
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
