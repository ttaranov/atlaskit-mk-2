import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, editorUrl } from '../_helpers';

const editors = [
  {
    name: 'comment',
    path: `${editorUrl}=comment`,
    placeholder: 'input[placeholder="What do you want to say?"]',
  },
  {
    name: 'fullpage',
    path: `${editorUrl}=full-page`,
    placeholder: 'p',
  },
];

const input = 'HELLO_WORLD';
const editable = '.ProseMirror';

editors.forEach(editor => {
  BrowserTestCase(
    `User should be able to select normal text style for ${editor.name} editor`,
    { skip: ['edge', 'ie'] },
    async client => {
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.type(editable, input);
      await browser.click('[aria-label="Change formatting"]');
      await browser.waitForSelector('span=Normal text');
      await browser.click('span=Normal text');
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  for (let i = 1; i <= 6; i) {
    BrowserTestCase(
      `User should be able to select heading${i} for ${editor.name} editor`,
      { skip: ['edge', 'ie'] },
      async client => {
        const browser = await new Page(client);
        await browser.goto(editor.path);
        await browser.waitForSelector(editor.placeholder);
        await browser.click(editor.placeholder);
        await browser.type(editable, input);
        await browser.click('[aria-label="Change formatting"]');
        await browser.waitForSelector(`span=Heading ${i}`);
        await browser.click(`span=Heading ${i}`);
        const doc = await browser.$eval(editable, getDocFromElement);
        expect(doc).toMatchDocSnapshot();
      },
    );
  }
});

editors.forEach(editor => {
  BrowserTestCase(
    `User should be able to select Bold on toolbar for ${editor.name} editor`,
    { skip: ['edge', 'ie'] },
    async client => {
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector('[aria-label="Bold"]');
      await browser.click('[aria-label="Bold"]');
      await browser.type(editable, input);
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `User should be able to select Italic on toolbar for ${editor.name} editor`,
    { skip: ['edge', 'ie'] },
    async client => {
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector('[aria-label="Italic"]');
      await browser.click('[aria-label="Italic"]');
      await browser.type(editable, input);
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `User should be able to select Underline on toolbar for ${
      editor.name
    } editor`,
    { skip: ['edge', 'ie'] },
    async client => {
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.waitForSelector(
        '[aria-label="Open or close advance text formatting dropdown"]',
      );
      await browser.click(
        '[aria-label="Open or close advance text formatting dropdown"]',
      );
      await browser.waitForSelector(`span=Underline`);
      await browser.click(`span=Underline`);
      await browser.type(editable, input);
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `User should be able to select Clear Formatting on toolbar for ${
      editor.name
    } editor`,
    { skip: ['edge', 'ie'] },
    async client => {
      const browser = await new Page(client);
      await browser.goto(editor.path);
      await browser.waitForSelector(editor.placeholder);
      await browser.click(editor.placeholder);
      await browser.click(
        '[aria-label="Open or close advance text formatting dropdown"]',
      );
      await browser.waitForSelector('[aria-label="Bold"]');
      await browser.click('[aria-label="Bold"]');
      await browser.type(editable, 'test');
      await browser.click(
        '[aria-label="Open or close advance text formatting dropdown"]',
      );
      await browser.click(`span=Clear Formatting`);
      await browser.type(editable, 'cleared');
      const doc = await browser.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
