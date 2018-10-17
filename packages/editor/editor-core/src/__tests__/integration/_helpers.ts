/**
 * This function will in browser context. Make sure you call `toJSON` otherwise you will get:
 * unknown error: Maximum call stack size exceeded
 * And, don't get too fancy with it ;)
 */
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { messages as insertBlockMessages } from '../../plugins/insert-block/ui/ToolbarInsertBlock';

export const getDocFromElement = el => el.pmViewDesc.node.toJSON();
export const editable = '.ProseMirror';
export const LONG_WAIT_FOR = 5000;
export const mentionPicker = '.ak-mention-picker';

export const insertMention = async (browser, query: string) => {
  await browser.type(editable, '@');
  await browser.waitForSelector(mentionPicker);
  await browser.type(editable, query);
  await browser.type(editable, 'Return');
};

export const insertMentionUsingClick = async (browser, mentionId: string) => {
  await browser.type(editable, '@');
  await browser.waitForSelector(mentionPicker);
  await browser.isVisible(`div[data-mention-id="${mentionId}"`);
  await browser.click(`div[data-mention-id="${mentionId}"`);
};

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

export const fullpageDisabled = {
  name: 'fullpage-disabled',
  path: getExampleUrl('editor', 'editor-core', 'full-page-with-content'),
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
  const mediaCardSelector = `${editable} .img-wrapper`;

  const existingMediaCards = await browser.$$(mediaCardSelector);

  await browser.click(openMediaPopup);

  // wait for media item, and select it
  await browser.waitForSelector(
    '.e2e-recent-upload-card [aria-label="one.svg"]',
  );
  if (filenames) {
    for (const filename of filenames) {
      const selector = fileSelector.replace('%s', filename);
      await browser.waitFor(selector);
      await browser.click(selector);
    }
  }
  // wait for insert button to show up and
  // insert it from the picker dialog
  await browser.waitForSelector(insertMediaButton);
  await browser.click(insertMediaButton);
  await browser.waitFor('.img-wrapper');

  // Wait until we have found media-cards for all inserted items.
  const mediaCardCount = get$$Length(existingMediaCards) + filenames.length;

  // Workaround - we need to use different wait methods depending on where we are running.
  if (browser.browser.desiredCapabilities) {
    await browser.browser.waitUntil(async () => {
      const mediaCards = await browser.$$(mediaCardSelector);
      return get$$Length(mediaCards) === mediaCardCount;
    });
  } else {
    await browser.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    await browser.waitFor(
      (mediaCardSelector, mediaCardCount) => {
        const mediaCards = document.querySelectorAll(mediaCardSelector);
        return mediaCards.length === mediaCardCount;
      },
      {},
      mediaCardSelector,
      mediaCardCount,
    );
  }
};

/**
 * We use $$ in the context of selenium and puppeteer, which return different results.
 */
const get$$Length = result => {
  if (Array.isArray(result)) {
    // Puppeteer result
    return result.length;
  } else {
    // Webdriver result
    return result.value.length;
  }
};

export const insertBlockMenuItem = async (
  browser,
  menuTitle,
  tagName = 'span',
) => {
  const openInsertBlockMenuSelector = `[aria-label="${
    insertBlockMessages.insertMenu.defaultMessage
  }"]`;

  await browser.click(openInsertBlockMenuSelector);

  const menuSelector = `${tagName}=${menuTitle}`;
  await browser.waitForSelector(menuSelector);
  await browser.click(menuSelector);
};

export const changeSelectedNodeLayout = async (page, layoutName) => {
  const buttonSelector = `div[aria-label="Floating Toolbar"] span[aria-label="${layoutName}"]`;
  await page.waitForSelector(buttonSelector, 3000);
  await page.click(buttonSelector);
};

/**
 * When using quick insert, `insertTitle` should match exactly to the typeahead wording.
 * We need to filter down the typeahead, as we select the first result.
 * Edge appears to have a problem with await browser.browser.waitUntil().
 * The statement at the bottom of the async function returns `firstInsertText && firstInsertText.startsWith(firstTitleWord)`
 * Even when this is true the waitUntil doesn’t return.
 */

export const quickInsert = async (browser, insertTitle) => {
  const firstTitleWord = insertTitle.split(' ')[0];

  // Quick insert doesnt work in FF, as `keys` isn't supported.
  if (browser.browser.desiredCapabilities.browserName === 'firefox') {
    await quickInsertActiveElement(browser, firstTitleWord);
  } else {
    await browser.keys('/');
    await browser.waitFor('div[aria-label="Popup"]');
    await browser.keys(firstTitleWord);
  }

  await browser.browser.waitUntil(async () => {
    let firstInsertText = await browser.browser.getText(
      '[aria-label="Popup"] [role="button"]',
    );
    if (Array.isArray(firstInsertText)) {
      firstInsertText = firstInsertText[0];
    }

    return firstInsertText && firstInsertText.startsWith(firstTitleWord);
  }, LONG_WAIT_FOR);

  await browser.click('[aria-label="Popup"] [role="button"]');
};

/**
 * Firefox has deprecated `keys`, this is a workaround to type in Firefox.
 * @see https://stackoverflow.com/a/44712416
 */
const quickInsertActiveElement = async (browser, insertTitle) => {
  const result = await browser.browser.elementActive();
  // Newer versions of the webdriver like Gecko/IEDriver return the element as "element-6066-11e4-a52e-4f735466cecf"
  // (which is documented in the W3C specs) instead of "ELEMENT".
  const activeElement =
    result.value &&
    (result.value.ELEMENT ||
      result.value['element-6066-11e4-a52e-4f735466cecf']);
  if (activeElement) {
    await browser.browser.elementIdValue(activeElement, '/');
    await browser.waitFor('div[aria-label="Popup"]');
    await browser.browser.elementIdValue(activeElement, insertTitle);
  }
};
