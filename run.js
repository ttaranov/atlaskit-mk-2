//@flow
const axios = require('axios');
const chalk = require('chalk');

const PIPELINE_ID = process.argv[2] || '17548';

function colorSuccess(str, success) {
  if (success) {
    return chalk.green(str);
  }
  return chalk.red(str);
}

(async () => {
  const endpoint = `https://api.bitbucket.org/2.0/repositories/atlassian/atlaskit-mk-2/pipelines`;
  console.log('Fetching build...');
  let resp = await axios.get(`${endpoint}/${PIPELINE_ID}`);
  if (!resp || !resp.data) {
    console.error('Unable to find build: ', PIPELINE_ID);
    process.exit(1);
  }

  const stepsUrl = `${endpoint}/${PIPELINE_ID}/steps/`;
  console.log('Fetching steps...');
  resp = await axios.get(stepsUrl);
  if (!resp || !resp.data) {
    console.error('Unable to find build: ', PIPELINE_ID);
    process.exit(1);
  }

  const steps = resp.data.values;
  const failedSteps = [];
  console.log(`Found ${steps.length} steps:`);
  steps.forEach(step => {
    const successful = step.state.result.name === 'SUCCESSFUL';
    if (!successful) {
      failedSteps.push(step);
    }
    console.log(
      colorSuccess(`  "${step.name}": ${step.state.result.name}`, successful),
    );
  });

  console.log('Failed steps', failedSteps.length);
  for (const step of failedSteps) {
    const stepUuid = step.uuid;
    resp = await axios.get(`${endpoint}/${PIPELINE_ID}/steps/${stepUuid}/log`);
    if (!resp || !resp.data) {
      console.error('Unable to find steps for uuid: ', stepUuid);
      process.exit(1);
    }

    // console.log(resp.data)
    console.log(`${endpoint}/${PIPELINE_ID}/steps/${stepUuid}/log`);
  }
})();
