// @flow
const fs = require('fs');

function getBuildUrlFromNetlifyLog(pathToNetlifyOutputFile /*: string */) {
  const logFile = fs.readFileSync(pathToNetlifyOutputFile, 'utf-8');
  const lines = logFile.split('\n');
  const indexOfLineBeforeUrl = lines.findIndex(
    line => line.indexOf('Deploy is live (permalink):') > -1,
  );
  const permalinkUrlMatch = lines[indexOfLineBeforeUrl + 1].match(
    /http:\/\/.+?.netlify.com/,
  );
  if (!permalinkUrlMatch) {
    console.error(`Unable to find permalinkUrl in ${pathToNetlifyOutputFile}`);
    throw new Error(
      `Unable to find permalinkUrl in ${pathToNetlifyOutputFile}`,
    );
  }
  const permalinkUrl = permalinkUrlMatch[0];

  return permalinkUrl;
}

module.exports = getBuildUrlFromNetlifyLog;
