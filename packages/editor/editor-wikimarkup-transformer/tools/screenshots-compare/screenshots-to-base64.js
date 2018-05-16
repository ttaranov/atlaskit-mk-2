'use strict';

const { readdirSync, readFileSync, writeFileSync } = require('fs');

const ASSETS_DIR = `${__dirname}/assets`;

const screenshotsJira = {};
const screenshotsParser = {};

function readFileAsBase64(file) {
  const buf = readFileSync(file);
  return buf.toString('base64');
}

function main() {
  for (const fileName of readdirSync(ASSETS_DIR)) {
    if (!fileName.endsWith('.png')) {
      continue;
    }

    const matches = fileName.match(/^(ED\-[\w]+)/);
    const issueKey = matches[1];
    const filePath = `${ASSETS_DIR}/${fileName}`;

    if (fileName.endsWith('-jira.png')) {
      screenshotsJira[issueKey] = readFileAsBase64(filePath);
    } else if (fileName.endsWith('-parser.png')) {
      screenshotsParser[issueKey] = readFileAsBase64(filePath);
    }
  }

  const jiraBase64ScreenshotsFilePath = `${__dirname}/assets/screenshots-jira.js`;
  console.warn(
    `Write JIRA base64 screenshots into ${jiraBase64ScreenshotsFilePath}`,
  );
  writeFileSync(
    jiraBase64ScreenshotsFilePath,
    `screenshotsJira = ${JSON.stringify(screenshotsJira, null, 2)}`,
  );

  const parserBase64ScreenshotsFilePath = `${__dirname}/assets/screenshots-parser.js`;
  console.warn(
    `Write parser base64 screenshots into ${parserBase64ScreenshotsFilePath}`,
  );
  writeFileSync(
    parserBase64ScreenshotsFilePath,
    `screenshotsParser = ${JSON.stringify(screenshotsParser, null, 2)}`,
  );
}

process.on('unhandledRejection', reason => {
  console.error('Unhaldled promise rejection: %s', reason.stack);
  process.exit(1);
});

process.on('uncaughtException', err => {
  console.error('Uncaught exception: %s', err.message);
});

main();
