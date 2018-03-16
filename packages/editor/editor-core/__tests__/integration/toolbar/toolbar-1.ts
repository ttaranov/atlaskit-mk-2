import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, editorUrl } from '../_helpers';

const more = '[aria-label="Open or close advance text formatting dropdown"]';
const underline = 'span=Underline';
const clear = 'span=Clear Formatting';
const changeFormatting = '[aria-label="Change formatting"]';
const normalText = 'span=Normal text';
const editors = [
  {
    name: 'comment',
    path: `${editorUrl}=comment`,
    placeholder: '[placeholder="What do you want to say?"]',
  },
  {
    name: 'fullpage',
    path: `${editorUrl}=full-page`,
    placeholder: 'p',
  },
];

const input = 'helloworld';
const editorSelector = '.ProseMirror';

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
      await browser.type(editorSelector, input);
      await browser.click(changeFormatting);
      await browser.click(normalText);
      const doc = await browser.$eval(editorSelector, getDocFromElement);
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
      await browser.type(editorSelector, input);
      const doc = await browser.$eval(editorSelector, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `Toolbar: should be able to select Italic on toolbar for ${
      editor.name
    } editor`,
    async client => {
      const italic = '[aria-label="Italic"]';
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(italic);
      await browser.click(italic);
      await browser.type(editorSelector, input);
      const doc = await browser.$eval(editorSelector, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `Toolbar: should be able to select Underline on toolbar for ${
      editor.name
    } editor`,
    async client => {
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.click(more);
      await browser.click(underline);
      await browser.type(editorSelector, input);
      const doc = await browser.$eval(editorSelector, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `Toolbar: should be able to select Clear Formatting on toolbar for ${
      editor.name
    } editor`,
    async client => {
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(more);
      await browser.click(more);
      await browser.waitForSelector(underline);
      await browser.click(underline);
      await browser.type(editorSelector, 'test');
      await browser.click(more);
      await browser.click(clear);
      await browser.type(editorSelector, 'cleared');
      const doc = await browser.$eval(editorSelector, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
