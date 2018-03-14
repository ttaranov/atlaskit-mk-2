// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

const urlHome = `${global.__baseUrl__}`;

const app = '#app';
const atlaskitLayer = 'main';
const atlaskitLogo = '[alt="Atlaskit logo"]';
const atlaskitTitle = 'h1';

BrowserTestCase(
  `The website home page should be displayed without errors`,
  async client => {
    const homeTest = await new Page(client);
    await homeTest.goto(urlHome);
    await homeTest.waitForSelector(app);
    const title = await homeTest.getText(atlaskitTitle);
    const pageIsVisible = await homeTest.isVisible(atlaskitLayer);
    // eslint-disable-next-line
    expect(atlaskitLogo).toBe(true);
    expect(title).toBe('Atlaskit');
    expect(pageIsVisible).toBe(true);
    if (homeTest.log('browser').value) {
      homeTest.log('browser').value.forEach(val => {
        // React 16 issue - https://github.com/hyperfuse/react-anime/issues/33
        if (
          !val.message.includes('The tag <main> is unrecognized unrecognized')
        ) {
          assert.notEqual(
            val.level,
            'SEVERE',
            `Console errors :${val.message} when navigating to the home page`,
          );
        }
      });
    }
  },
);
