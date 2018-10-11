// @flow

/* Currently, this test will check if the form and its component renders into different browsers.
Some actual functional tests need to be added:
- Interaction with all fields
- Submit the form
Those tests should be added before the release candidate*/
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
// TODO: AK-5546: There is an issue with .log
// import * as assert from 'assert';

/* Url to test the example */
const urlFormCreateRepo = getExampleUrl('core', 'form', 'create-repository');

/* Css selectors used for the test */
const createForm = '[name="create-repo"]';
const owner = 'div:nth-child(1) > div > [role="status"]';
const project = 'div:nth-child(2) > div > [role="status"]';
const repoName = '[name="repo_name"]';
const accessLevel = 'div:nth-child(4) > div';
const includeReadme = 'div:nth-child(5) > div > [role="status"]';
const createRepoBtn = 'footer > button:nth-child(1)';
const cancelBtn = 'footer > button:nth-child(2)';

const cssSelectorsForm = [
  owner,
  project,
  repoName,
  accessLevel,
  includeReadme,
  createRepoBtn,
  cancelBtn,
];

BrowserTestCase(
  'form.js: Create repository form should render without errors',
  { skip: ['safari'] }, // Safari has an issue with css / wd / puppeeter at the moment - to be investigated
  async client => {
    const formTest = new Page(client);
    await formTest.goto(urlFormCreateRepo);
    await formTest.waitForSelector(createForm);

    cssSelectorsForm.forEach(async cssSelector => {
      const selectorIsVisible = await formTest.isVisible(cssSelector);
      expect(selectorIsVisible).toBe(true);
    });
    // TODO: AK-5546: There is an issue with .log
    // if (formTest.log('browser').value) {
    //   formTest.log('browser').value.forEach(val => {
    //     assert.notEqual(
    //       val.level,
    //       'SEVERE',
    //       `Console errors :${val.message} when view the form`,
    //     );
    //   });
    // }
  },
);
