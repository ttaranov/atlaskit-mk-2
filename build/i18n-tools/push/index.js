const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const globby = require('globby');
const Transifex = require('transifex');
const reactIntlPot = require('babel-plugin-react-intl-pot');
const { errorAndExit } = require('../utils');

async function pushCommand(absPathToPackage, searchDir, project, resource) {
  const { TRANSIFEX_API_TOKEN } = process.env;

  if (!TRANSIFEX_API_TOKEN) {
    errorAndExit(
      'TRANSIFEX_API_TOKEN is missing. This env var is required for accessing Transifex',
    );
  }

  const transifex = new Transifex({
    project_slug: project,
    credential: `api:${TRANSIFEX_API_TOKEN}`,
  });

  const dirToSearch = path.join(absPathToPackage, searchDir);
  const jsFiles = globby
    .sync(['**/*.js'], { cwd: dirToSearch })
    .map(file => path.join(dirToSearch, file));
  console.log(`Found ${jsFiles.length} files in ${searchDir} directory...`);

  const extractionPromises = jsFiles.map(extractMessagesFromFile);
  const allMessagesFromFiles = await Promise.all(extractionPromises);
  const messages = allMessagesFromFiles.reduce(
    (allMessages, nextMessages) => [...allMessages, ...nextMessages],
    [],
  );

  // Search for duplicate messageIds
  const duplicateMessageIds = messages
    .map(m => m.id)
    .filter((id, idx, arr) => arr.indexOf(id) !== idx);
  if (duplicateMessageIds.length !== 0) {
    errorAndExit('Error: Duplicate messageIds found', duplicateMessageIds);
  }

  console.log(`Found ${messages.length} messages...`);

  const content = reactIntlPot.msg2pot(messages);

  if (content.length === 0) {
    errorAndExit('Error: Invalid POT file!');
  }

  transifex.uploadSourceLanguageMethod(
    project,
    resource,
    {
      slug: resource,
      name: resource + '.pot',
      i18n_type: 'PO',
      content,
    },
    (error, data) => {
      if (error) {
        console.log(error);
        errorAndExit(`Error: Couldn't upload file to Transifex!`);
      }

      console.log(
        `\nSuccess:\nAdded: ${data.strings_added}\nUpdated: ${
          data.strings_updated
        }\nDeleted: ${data.strings_delete}`,
      );
    },
  );
}

function extractMessagesFromFile(file) {
  return new Promise((resolve, reject) => {
    const babelConfig = { plugins: ['react-intl'] };
    babel.transformFile(file, babelConfig, (err, res) => {
      if (err) reject(err);
      else resolve(res.metadata['react-intl'].messages);
    });
  });
}

module.exports = pushCommand;
