/**
 * This function will in browser context. Make sure you call `toJSON` otherwise you will get:
 * unknown error: Maximum call stack size exceeded
 * And, don't get too fancy with it ;)
 */
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { sleep } from '@atlaskit/editor-test-helpers';
import { messages as insertBlockMessages } from '../../plugins/insert-block/ui/ToolbarInsertBlock';

export const getDocFromElement = el => el.pmViewDesc.node.toJSON();
export const editable = '.ProseMirror';

export const comment = {
  name: 'comment',
  path: getExampleUrl('editor', 'editor-core', 'comment'),
  placeholder: '[placeholder="What do you want to say?"]',
};

export const fullpage = {
  name: 'fullpage',
  path: getExampleUrl('editor', 'editor-core', 'full-page-with-toolbar'),
  placeholder: '.ProseMirror',
};

export const message = {
  name: 'message',
  path: getExampleUrl('editor', 'editor-core', 'message'),
  placeholder: '.ProseMirror',
};

export const editors = [comment, fullpage];

export const clipboardHelper = getExampleUrl(
  'editor',
  'editor-core',
  'clipboard-helper',
);

export const clipboardInput = '#input';

export const copyAsPlaintextButton = '#copy-as-plaintext';
export const copyAsHTMLButton = '#copy-as-html';

export const mediaInsertDelay = 1000;

const mediaPickerMock = '.mediaPickerMock';
export const setupMediaMocksProviders = async browser => {
  // enable the media picker mock
  await browser.waitForSelector(mediaPickerMock);
  await browser.click(mediaPickerMock);

  // since we're mocking and aren't uploading a real endpoint, skip authenticating
  // (this also skips loading from a https endpoint which we can't do from inside the http-only netlify environment)
  await browser.click('.mediaProvider-resolved-no-auth-provider');

  // reload the editor so that media provider changes take effect
  await browser.click('.reloadEditorButton');
};

export const insertMedia = async (
  browser,
  filenames = ['one.svg'],
  fileSelector = 'div=%s',
) => {
  const openMediaPopup = `[aria-label="${
    insertBlockMessages.filesAndImages.defaultMessage
  }"]`;
  const insertMediaButton = '.e2e-insert-button';

  await browser.click(openMediaPopup);

  // wait for media item, and select it
  await browser.waitForSelector('.media-card');
  if (filenames) {
    for (const filename of filenames) {
      const selector = fileSelector.replace('%s', filename);
      await browser.waitFor(selector, 3000);
      await browser.click(selector);
    }
  }
  // wait for insert button to show up and
  // insert it from the picker dialog
  await browser.waitForSelector(insertMediaButton, 2000);
  await browser.click(insertMediaButton);

  // after clicking Insert media, the media plugin needs to upload the file,
  // and generate some intermediate processing and preview states while that's happening
  //
  // we currently don't map the media state as a CSS selector
  await sleep(mediaInsertDelay);
};
