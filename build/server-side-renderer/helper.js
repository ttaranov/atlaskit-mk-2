//@flow
'use strict';
/*
* server side renderer utilities helper to return all the examples and filter by packages
*/
const boltQuery = require('bolt-query');
const glob = require('glob');
const path = require('path');

// Get all examples for a specified package using Bolt-Query
async function getExamplesFor(
  pkgName /*: string */,
) /*: Promise<Array<string>> */ {
  const project /*: any */ = await boltQuery({
    cwd: path.join(__dirname, '..'),
    workspaceFiles: {
      examples: 'examples/*.+(js|ts|tsx)',
    },
  });
  let examples = [];
  project.workspaces.forEach(workspace => {
    if (workspace.pkg && workspace.pkg.name.split('/')[1] === pkgName) {
      examples.push(...workspace.files.examples);
    }
  });
  return examples;
}

module.exports = { getExamplesFor };
