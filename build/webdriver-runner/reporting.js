// @flow
const fetch = require('node-fetch');
const get = require('lodash.get');

/**
 * Test that fail, cause other blocks in the same file to cascade fail
 * So as a result we only pull out the first error as the cascade results aren't useful
 * To determine flaky tests.
 */
const extractResultInformationIntoProperties = results => {
  return results.testResults
    .filter(
      test =>
        test.numFailingTests > 0 ||
        (test.failureMessage && results.numFailedTestSuites > 0),
    )
    .map(test => ({
      failingTests: test.numFailingTests,
      testFilePath: test.testFilePath.replace(process.cwd(), ''), // Relative path to test
      failureMessage:
        get(test, 'testResults[0].failureMessages[0]') || test.failureMessage,
      duration: get(test, 'testResults[0].duration', 0),
      testName: get(test, 'testResults[0].fullName'),
      buildNumber: process.env.BITBUCKET_BUILD_NUMBER,
      branch: process.env.BITBUCKET_BRANCH,
    }));
};

const buildEventPayload = properties => {
  return {
    name: 'atlaskit.qa.integration_test.failure',
    properties,
    server: process.env.CI ? 'master' : 'test',
    product: 'atlaskit',
    user: process.env.CI ? '-' : process.env.USER, // On CI we send as an anonymous user
    serverTime: Date.now(),
  };
};

module.exports = async (results /*: Object */) => {
  const properties = extractResultInformationIntoProperties(results);

  if (!properties.length) {
    return;
  }

  await fetch('https://analytics.atlassian.com/analytics/events', {
    method: 'POST',
    headers: {
      Accept: 'application/json, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      events: properties.map(buildEventPayload),
    }),
  });

  console.log(
    `Sent ${properties.length} integration test failure event${
      properties.length > 1 ? 's' : ''
    }`,
  );
};
