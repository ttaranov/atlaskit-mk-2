// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

const urlOnBoarding = `${
  global.__baseUrl__
}/examples.html?groupId=core&packageId=onboarding&exampleId=spotlight-autoscroll`;

const OnBoardingDefault = '#examples p:nth-child(3) > button';
const OnBoardingMenuTitle = 'span h4';

BrowserTestCase(
  'AK-4279 - Clicking on show should display the onboarding and no errors',
  { skip: ['safari'] }, // Safari has an issue at the moment
  async client => {
    const onBoardingTest = await new Page(client);
    await onBoardingTest.goto(urlOnBoarding);
    await onBoardingTest.click(OnBoardingDefault);
    const menuIsVisible = await onBoardingTest.isVisible(OnBoardingMenuTitle);
    // eslint-disable-next-line
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
