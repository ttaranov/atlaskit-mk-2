// @flow
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const urlSpotlightScroll = getExampleUrl(
  'core',
  'onboarding',
  'spotlight-autoscroll',
);
const urlSpotlightBasic = getExampleUrl(
  'core',
  'onboarding',
  'spotlight-basic',
);
const OnBoardingDefault = '#examples p:nth-child(3) > button';
const OnBoardingMenuTitle = 'div h4';
const startBtn = '#examples > button';
const tellMeMoreBtn = '[type="button"]';

BrowserTestCase(
  'on-boarding.js: AK-4279 - Clicking on show should display the onboarding and no errors',
  { skip: ['safari', 'edge'] }, // Safari and Edge have issues at the moment
  async client => {
    const onBoardingTest = new Page(client);
    await onBoardingTest.goto(urlSpotlightScroll);
    await onBoardingTest.click(OnBoardingDefault);
    const menuIsVisible = await onBoardingTest.isVisible(OnBoardingMenuTitle);
    expect(menuIsVisible).toBe(true);
    await onBoardingTest.checkConsoleErrors();
  },
);

BrowserTestCase(
  'on-boarding.js: AK-5612 - Blanket should never be on top of the spotlight modal',
  { skip: ['safari', 'edge', 'firefox', 'chrome'] }, // The actual issue was only occuring in IE11
  async client => {
    const onBoardingTest = new Page(client);
    await onBoardingTest.goto(urlSpotlightBasic);
    await onBoardingTest.click(startBtn);
    await onBoardingTest.waitFor(OnBoardingMenuTitle, 5000);
    const menuIsVisible = await onBoardingTest.isVisible(OnBoardingMenuTitle);
    expect(menuIsVisible).toBe(true);
    await onBoardingTest.click(tellMeMoreBtn);
    await onBoardingTest.waitFor(OnBoardingMenuTitle, 5000);
    const text = await onBoardingTest.getText(OnBoardingMenuTitle);
    expect(text).toBe('Yellow');
  },
);
