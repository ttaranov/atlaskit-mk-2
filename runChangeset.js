// @flow

/* eslint-disable no-console */
const { changesetCommand } = require('./build/releases/changeset');

(async () => {
  try {
    await changesetCommand();
  } catch (e) {
    console.log('Changeset Failed', e);
  }
  console.log('completed changeset');
})();
