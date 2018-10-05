// @flow
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

const urlOnBoarding = getExampleUrl(
  'core',
  'onboarding',
  'spotlight-autoscroll',
);
const OnBoardingDefault = '#examples p:nth-child(3) > button';
const OnBoardingMenuTitle = 'div h4';

BrowserTestCase(
  'AK-4279 - Clicking on show should display the onboarding and no errors',
  { skip: ['safari', 'edge'] }, // Safari and Edge have issues at the moment
  async client => {
    const onBoardingTest = new Page(client);
    await onBoardingTest.goto(urlOnBoarding);
    await onBoardingTest.click(OnBoardingDefault);
    const menuIsVisible = await onBoardingTest.isVisible(OnBoardingMenuTitle);
    expect(menuIsVisible).toBe(true);
    if (onBoardingTest.log('browser').value) {
      onBoardingTest.log('browser').value.forEach(val => {
        assert.notEqual(
          val.level,
          'SEVERE',
          `Console errors :${val.message} when clicked on the show button`,
        );
      });
    }
  },
);
