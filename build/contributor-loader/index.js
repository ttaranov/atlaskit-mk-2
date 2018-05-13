const bolt = require('bolt');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

module.exports = async function contributorLoader(source) {
  console.log(source);
  let contributions = {};
  let workspaces = await bolt.getWorkspaces({ cwd: process.cwd() });

  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;
  //console.log('from contribor loader');
  workspaces = workspaces.map(w =>
    Object.assign({}, w, { relativeDir: path.relative(projectRoot, w.dir) }),
  );

  for (let workspace of workspaces) {
    //console.log(workspace);
    const [, , name] = workspace.relativeDir.split(path.sep);
    if (name) {
      let contributor = await readFile(
        path.join(`${workspace.dir}/CONTRIBUTORS`),
        'utf8',
      );

      contributions[workspace.name] = JSON.parse(contributor);
    }
  }

  return `module.exports = ${JSON.stringify(contributions)}`;
};
