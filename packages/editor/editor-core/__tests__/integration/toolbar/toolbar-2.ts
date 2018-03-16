import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getDocFromElement, editorUrl } from '../_helpers';

const changeFormatting = '[aria-label="Change formatting"]';
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
  for (let i = 1; i <= 6; i++) {
    BrowserTestCase(
      `Toolbar: should be able to select heading${i} for ${editor.name} editor`,
      async client => {
        const browser = await new Page(client);
        await browser.goto(editor.path);
        await browser.waitForSelector(editor.placeholder);
        await browser.click(editor.placeholder);
        await browser.type(editorSelector, input);
        await browser.click(changeFormatting);
        await browser.waitForSelector(`span=Heading ${i}`);
        await browser.click(`span=Heading ${i}`);
        const doc = await browser.$eval(editorSelector, getDocFromElement);
        expect(doc).toMatchDocSnapshot();
      },
    );
  }
});
