import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  comment,
  fullpage,
  editable,
  clipboardHelper,
} from '../_helpers';

const clipboardInput = '#input';
const copyAsHTMLButton = '#copy-as-html';

// broken on firefox - https://product-fabric.atlassian.net/browse/ED-4337
[comment, fullpage].forEach(editor => {
  BrowserTestCase(
    `hyperlink-2.ts: Link - paste link and add text, paste link into list for ${
      editor.name
    } editor`,
    { skip: ['edge', 'ie', 'safari'] },
    async client => {
      const sample = new Page(client);
      const linkText1 = 'https://www.google.com';
      await sample.goto(clipboardHelper);
      await sample.isVisible(clipboardInput);
      await sample.type(
        clipboardInput,
        `<a href="${linkText1}">${linkText1}</a>`,
      );
      await sample.click(copyAsHTMLButton);
      await sample.goto(editor.path);
      await sample.waitForSelector(editor.placeholder);
      await sample.click(editor.placeholder);
      await sample.waitForSelector(editable);
      await sample.paste(editable);
      await sample.type(editable, '.');
      await sample.type(editable, 'Return');

      // paste link into list
      await sample.type(editable, '* ');
      await sample.waitForSelector('li');
      await sample.paste(editable);

      await sample.waitForSelector('a');
      const doc = await sample.$eval(editable, getDocFromElement);
      expect(doc).toMatchDocSnapshot();
    },
  );
});
