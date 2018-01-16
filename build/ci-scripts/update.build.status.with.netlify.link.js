const fs = require('fs');
const path = require('path');
const updateBuildStatus = require('../utils/updateBuildStatus');

const pathToNetlifyOutputFile = path.join(__dirname, '..', '..', 'output.txt');

try {
  const logFile = fs.readFileSync(pathToNetlifyOutputFile, 'utf-8');
  const lines = logFile.split('\n');
  const indexOfLineBeforeUrl = lines.findIndex(
    line => line.indexOf('Deploy is live (permalink):') > -1,
  );
  const permalinkUrlMatch = lines[indexOfLineBeforeUrl + 1].match(
    /http:\/\/.+?.netlify.com/,
  );
  if (!permalinkUrlMatch) {
    console.error('Unable to find permalinkUrl in output.txt');
    process.exit(1);
  }
  const permalinkUrl = permalinkUrlMatch[0];
  const buildStatusOpts = {
    buildName: 'Netlify build',
    description: 'A static preview build hosted on netlify',
    url: permalinkUrl,
    state: 'SUCCESSFUL',
  };
  console.log('Updating build status...');
  updateBuildStatus(buildStatusOpts);
} catch (e) {
  console.error('Unable to update build status');
  console.error(e.toString());
}
