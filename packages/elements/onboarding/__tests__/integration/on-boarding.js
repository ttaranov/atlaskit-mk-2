// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlOnBoarding = `${
  global.__baseUrl__
}/mk-2/packages/elements/onboarding/example/spotlight-autoscroll`;

const OnBoardingDefault = '[role="dialog"] p:nth-child(3) > button';
const OnBoardingMenuTitle =
  '#app > div > div:nth-child(3) > div > div > div > div > div > div > h4';

BrowserTestCase(
  'AK-4279 - Clicking on show should display the onboarding and no errors',
  async client => {
    const onBoardingTest = await new Page(client);
    await onBoardingTest.goto(urlOnBoarding);
    await onBoardingTest.click(OnBoardingDefault);
    const menuIsVisible = await onBoardingTest.isVisible(OnBoardingMenuTitle);
    // eslint-disable-next-line
    expect(menuIsVisible).toBe(true);
  },
);
