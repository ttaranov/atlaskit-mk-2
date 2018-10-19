// @flow

/* Currently, this test will check if the form and its component renders into different browsers.
Some actual functional tests need to be added:
- Interaction with all fields
- Submit the form
Those tests should be added before the release candidate*/
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

/* Url to test the example */
const urlFormCreateRepo = getExampleUrl('core', 'form', 'create-repository');

/* Css selectors used for the test */
const createForm = '[name="create-repo"]';
const owner = 'form > div:nth-child(2) > div > div:nth-child(1)';
const project = 'form > div:nth-child(2) > div > div:nth-child(2)';
const repoName = '[name="repo_name"]';
const accessLevel = 'form > div:nth-child(2) > div > div:nth-child(4)';
const includeReadme = 'form > div:nth-child(2) > div > div:nth-child(5)';
const createRepoBtn = 'footer > button:nth-child(1)';
const cancelBtn = 'footer > button:nth-child(2)';

BrowserTestCase(
  'form.js: Create repository form should render without errors',
  { skip: ['safari'] }, // Safari has an issue with css / wd / puppeeter at the moment - to be investigated
  async client => {
    const formTest = new Page(client);
    await formTest.goto(urlFormCreateRepo);
    await formTest.waitForSelector(createForm);
    const ownerIsVisible = await formTest.isVisible(owner);
    const projectIsVisible = await formTest.isVisible(project);
    const repoNameIsVisible = await formTest.isVisible(repoName);
    const accessLevelIsVisible = await formTest.isVisible(accessLevel);
    const includeReadmeIsVisible = await formTest.isVisible(includeReadme);
    const createRepoBtnIsVisible = await formTest.isVisible(createRepoBtn);
    const cancelBtnIsVisible = await formTest.isVisible(cancelBtn);
    expect(ownerIsVisible).toBe(true);
    expect(projectIsVisible).toBe(true);
    expect(repoNameIsVisible).toBe(true);
    expect(accessLevelIsVisible).toBe(true);
    expect(includeReadmeIsVisible).toBe(true);
    expect(createRepoBtnIsVisible).toBe(true);
    expect(cancelBtnIsVisible).toBe(true);
    if (formTest.log('browser').value) {
      formTest.log('browser').value.forEach(val => {
        assert.notEqual(
          val.level,
          'SEVERE',
          `Console errors :${val.message} when view the form`,
        );
      });
    }
  },
);
