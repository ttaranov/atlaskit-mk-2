// @flow
const path = require('path');
const loaderUtils = require('loader-utils');
const globby = require('globby');
const bolt = require('bolt');
const { dir, buildFs } = require('./buildFs');

/*::
import type { Directory, File, LoaderOptions } from './types';
*/

module.exports = async function boltNavLoader() {
  const opts /*: LoaderOptions */ = Object.assign(
    {
      include: [],
      exclude: [],
      debug: true,
      configProps: [],
    },
    loaderUtils.getOptions(this) || {},
  );

  // 1. We load all getWorkspaces
  let workspaces = await bolt.getWorkspaces({
    cwd: path.join(process.cwd(), '../packages'),
  });

  // 2. We filter workspaces based on our include list
  const projectRoot = (await bolt.getProject({ cwd: process.cwd() })).dir;

  workspaces = workspaces.map(w =>
    Object.assign({}, w, { relativeDir: w.dir.replace(`${projectRoot}/`, '') }),
  );

  const patterns = []
    .concat(opts.include)
    .concat((opts.exclude || []).map(p => `!${p}`));

  // Separate option for exclude is necessary since webpack treats ! as a sign of a loader
  // which blocks us from using it inside import statement
  const files /*: Array<string> */ = await globby(patterns, {
    cwd: projectRoot,
  });

  let packages = {};

  for (let workspace of workspaces) {
    if (!files.includes(workspace.relativeDir)) continue;

    const [a, team, name] = workspace.relativeDir.split(path.sep);
    if (!packages[team]) packages[team] = [];

    let info = {
      name,
      team,
      config: {},
    };

    opts.configProps.forEach(p => {
      if (workspace.config[p]) info.config[p] = workspace.config[p];
    });

    packages[team].push(info);
  }

  return `module.exports = ${JSON.stringify(packages)};`;
};
