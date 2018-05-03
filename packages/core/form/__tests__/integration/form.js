// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

const urlFormCreateRepo = getExampleUrl('core', 'form', 'create-repository');

const createForm = '.create-repo';
const owner =
  'div:nth-child(1) > div > div > div.react-select__value-container';
const project =
  'div:nth-child(2) > div > div > div.react-select__value-container';
const repoName = '[name="repo_name"]';
const accessLevel = '[name="access-level"]';
const includeReadme =
  'div:nth-child(5) > div > div > div.react-select__value-container';
const createRepoBtn = '[type="submit"]';
const cancelBtn = '[type="submit"]';

const cssSelectorsForm = [
  createForm,
  owner,
  project,
  repoName,
  accessLevel,
  includeReadme,
  createRepoBtn,
  cancelBtn,
];

BrowserTestCase(
  'Create repository form should render',
  //  { skip: ['safari', 'edge'] }, // Safari and Edge have issues at the moment
  async client => {
    const formTest = await new Page(client);
    await formTest.goto(urlFormCreateRepo);
    cssSelectorsForm.forEach(async cssSelector => {
      expect(await formTest.isVisible(cssSelector)).toBe(true);
    });
    // const formIsVisible = await formTest.isVisible(createForm);
    // const ownerFieldIsVisible = await formTest.isVisible(owner);
    // const projectFieldIsVisible = await formTest.isVisible(project);
    // const repoNameFieldIsVisible = await formTest.isVisible(repoName);
    // const accessLevelFieldIsVisible = await formTest.isVisible(accessLevel);
    // const includeReadmeFieldIsVisible = await formTest.isVisible(includeReadme);
    // const createRepoBtnFieldIsVisible = await formTest.isVisible(createRepoBtn);
    // const cancelBtnFieldIsVisible = await formTest.isVisible(cancelBtn);

    // eslint-disable-next-line
    // expect(formIsVisible).toBe(true);
    // expect(ownerFieldIsVisible).toBe(true);
    // expect(projectFieldIsVisible).toBe(true);
    // expect(repoNameFieldIsVisible).toBe(true);
    // expect(accessLevelFieldIsVisible).toBe(true);
    // expect(includeReadmeFieldIsVisible).toBe(true);
    // expect(createRepoBtnFieldIsVisible).toBe(true);
    // expect(cancelBtnFieldIsVisible).toBe(true);

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
