// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  startDevServer,
  stopDevServer,
} from '@atlaskit/webdriver-runner/utils/webpack';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

let urlHome;

// This has to be modified to correctly read the url from website
try {
  const netlifyLogFilePath = './netlify-build.txt';
  const fs = require('fs');

  const logFile = fs.readFileSync(netlifyLogFilePath, 'utf-8');
  const lines = logFile.split('\n');
  const indexOfLineBeforeUrl = lines.findIndex(
    line => line.indexOf('Deploy is live (permalink):') > -1,
  );
  const permalinkUrlMatch = lines[indexOfLineBeforeUrl + 1].match(
    /http:\/\/.+?.netlify.com/,
  );
  urlHome = permalinkUrlMatch[0];
} catch (err) {
  urlHome = 'https://atlaskit.atlassian.com/';
}

const app = '#app';
const atlaskitLayer = '[spacing="cosy"]';
const atlaskitLogo = '[alt="Atlaskit logo"]';
const atlaskitTitle = 'h1';

BrowserTestCase(
  `The website home page should be displayed without errors`,
  async client => {
    const homeTest = await new Page(client);
    await homeTest.goto(urlHome);
    await homeTest.waitForSelector(app);
    const title = await homeTest.getText(atlaskitTitle);
    const logo = await homeTest.isVisible(atlaskitLogo);
    const pageIsVisible = await homeTest.isVisible(atlaskitLayer);
    // eslint-disable-next-line
    expect(logo).toBe(true);
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
