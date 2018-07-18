// @flow

/* Currently, this test will check if the new navigation example renders into different browsers.*/
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

/* Url to test the example */
const urlNewNavigation = getExampleUrl('core', 'navigation-next', 'navigation');

/* Css selectors used for the test */
const content = '#examples > div > div > div';
const iconJira = '[aria-label="Jira"]';
const iconSearch = `${content} > div > div> div > div > div div:nth-child(2) > span`;
const iconCreate = `${content} > div > div> div > div > div div:nth-child(3) > span`;
const help = '[aria-label="Help"]';
const avatar = `${iconCreate} > div > div > button`;
const header = `${content} > div > div > div > div > div > div > div:nth-child(1)`;
const groupHeading = `${content} > div > div > div > div > div > div > div:nth-child(2)`;

const cssSelectorsNav = [iconJira, iconSearch, iconCreate, help, avatar];

BrowserTestCase(
  'The navigation example should render without errors',
  async client => {
    const navTest = await new Page(client);
    await navTest.goto(urlNewNavigation);
    await navTest.waitForSelector(content);

    cssSelectorsNav.forEach(async cssSelector => {
      const selectorIsVisible = await navTest.isVisible(cssSelector);
      expect(selectorIsVisible).toBe(true);
    });
    // Not sure why but those two selectors are found twice in the DOM
    expect(await navTest.isVisible(header)).toEqual([true, true]);
    expect(await navTest.isVisible(groupHeading)).toEqual([true, true]);
    if (navTest.log('browser').value) {
      navTest.log('browser').value.forEach(val => {
        assert.notEqual(
          val.level,
          'SEVERE',
          `Console errors :${val.message} when view the form`,
        );
      });
    }
  },
);
