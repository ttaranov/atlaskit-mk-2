/**
 * This function will in browser context. Make sure you call `toJSON` otherwise you will get:
 * unknown error: Maximum call stack size exceeded
 * And, don't get too fancy with it ;)
 */
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { sleep } from '@atlaskit/editor-test-helpers';
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

export const clipboardHelper = getExampleUrl(
  'editor',
  'editor-core',
  'clipboard-helper',
);

export const clipboardInput = '#input';

export const copyAsPlaintextButton = '#copy-as-plaintext';
export const copyAsHTMLButton = '#copy-as-html';

export const mediaInsertDelay = 200;

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

export const insertMedia = async (browser, indexes = [0]) => {
  const openMediaPopup = '[aria-label="Insert files and images"]';
  const insertMediaButton = '.e2e-insert-button';

  await browser.click(openMediaPopup);

  // wait for media item, and select it
  for (const index of indexes) {
    const selector =
      index === -1 ? 'last-of-type' : `nth-of-type(${index + 1})`;
    const mediaItem = `.e2e-recent-upload-card:${selector} div div`; /* div div selector required for Safari */
    await browser.waitForSelector(mediaItem);
    await browser.click(mediaItem);
  }

  // insert it from the picker dialog
  await browser.waitForSelector(insertMediaButton);
  await browser.click(insertMediaButton);

  // after clicking Insert media, the media plugin needs to upload the file,
  // and generate some intermediate processing and preview states while that's happening
  //
  // we currently don't map the media state as a CSS selector
  await sleep(mediaInsertDelay);
};
