import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

BrowserTestCase('this is my sample test', async client => {
  const sample = await new Page(client);
  // You should use the iframe url (isolated mode) otherwise the page can't find the example
  await sample.goto(
    'http://localhost:9000/examples.html?groupId=media&packageId=media-picker&exampleId=popup',
  );
  sample.waitForSelector('button');
  //inline code
  return true;
});
