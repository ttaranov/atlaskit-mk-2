import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  editors,
  clipboardHelper,
  editable,
} from '../_helpers';

const clipboardInput = '#input';
const copyAsHTMLButton = '#copy-as-html';
const linkText = 'https://www.atlassian.com';

editors.forEach(editor => {
  BrowserTestCase(
    `pasting link and adding punctuation should not linkify punctuation ${
      editor.name
    } editor`,
    async client => {
      let sample = await new Page(client);
      await sample.goto(clipboardHelper);
      await sample.isVisible(clipboardInput);
      await sample.type(
        clipboardInput,
        `<a href="${linkText}">${linkText}</a>`,
      );
      await sample.click(copyAsHTMLButton);

      await sample.goto(editor.path);
      await sample.waitForSelector(editor.placeholder);
      await sample.click(editor.placeholder);
      await sample.waitForSelector(editable);
      await sample.paste(editable);
      await sample.keys('ArrowRight');
      await sample.type(editable, ['.']);
      const doc = await sample.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `it should be possible to remove link using unlink button ${
      editor.name
    } editor`,
    async client => {
      const sample = await new Page(client);
      await sample.goto(editor.path);
      await sample.waitForSelector(editor.placeholder);
      await sample.click(editor.placeholder);
      await sample.type(editable, [`${linkText} `, 'ArrowLeft', 'ArrowLeft']);
      await sample.waitForSelector(`a=${linkText}`);
      await sample.click(`a=${linkText}`);
      await sample.waitForSelector('[aria-label=Unlink]');
      await sample.click('[aria-label=Unlink]');
      const doc = await sample.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `it should be possible to add link using toolbar button and recent search component ${
      editor.name
    } editor`,
    async client => {
      const sample = await new Page(client);
      await sample.goto(editor.path);
      await sample.waitForSelector(editor.placeholder);
      await sample.click(editor.placeholder);
      await sample.click('[aria-label="Add link"]');
      await sample.waitForSelector(
        '[placeholder="Paste link or search recently viewed"]',
      );
      await sample.type(
        '[placeholder="Paste link or search recently viewed"]',
        [linkText, 'Enter'],
      );
      const doc = await sample.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});

editors.forEach(editor => {
  BrowserTestCase(
    `pasting link in list should create link correctly ${editor.name} editor`,
    async client => {
      const sample = await new Page(client);
      await sample.goto(clipboardHelper);
      await sample.isVisible(clipboardInput);
      await sample.type(
        clipboardInput,
        `<a href="${linkText}">${linkText}</a>`,
      );
      await sample.click(copyAsHTMLButton);

      await sample.goto(editor.path);
      await sample.waitForSelector(editor.placeholder);
      await sample.click(editor.placeholder);
      await sample.type(editable, '* ');
      await sample.paste(editable);
      const doc = await sample.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
