import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import { editable, getDocFromElement } from '../_helpers';

const fullPageEditor = getExampleUrl(
  'editor',
  'editor-core',
  'full-page-with-toolbar',
);

BrowserTestCase(
  'Inserts a media single',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const mediaPickerMock = '.mediaPickerMock';

    const openMediaPopup = '[aria-label="Insert files and images"]';
    const mediaItem = '.e2e-recent-upload-card';
    const insertMediaButton = '.e2e-insert-button';

    const browser = await new Page(client);

    await browser.goto(fullPageEditor);
    await browser.waitForSelector(editable);

    // enable the media picker mock
    await browser.waitForSelector(mediaPickerMock);
    await browser.click(mediaPickerMock);

    // since we're mocking and aren't uploading a real endpoint, skip authenticating
    // (this is also a https endpoint which we can't load from inside the http-only netlify environment at this stage)
    await browser.click('.mediaProvider-resolved-no-auth-provider');

    // reload the editor so that media provider changes take effect
    await browser.click('.reloadEditorButton');

    // type some text
    await browser.click(editable);
    await browser.type(editable, 'some text');

    // now we can insert media as necessary
    await browser.click(openMediaPopup);

    // wait for media item, and select it
    await browser.waitForSelector(mediaItem);
    await browser.click(mediaItem);

    // insert it from the picker dialog
    await browser.waitForSelector(insertMediaButton);
    await browser.click(insertMediaButton);

    // wait for the nodeview to appear
    await browser.waitForSelector('.media-single');

    expect(await browser.isVisible('.media-single')).toBe(true);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchDocSnapshot();
  },
);
