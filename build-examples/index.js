// @flow

const bolt = require('bolt');

async function printWorkspaces() {
  const ws = await bolt.getWorkspaces();
  const wsPaths = ws.map(w => w.dir);
}

printWorkspaces().catch(err => console.log(`There is an error dude -> ${err}`));
