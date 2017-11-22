const { generateMarkdownTemplate } = require('./template');
const fs = require('fs');
const bolt = require('bolt');
const path = require('path');
const os = require('os');
const util = require('util');
const { sep } = require('path');
const logger = require('../../utils/logger');
const { DEPENDENCY_TYPES } = require('../constants');

function writeFile(filePath, fileContents) {
  return util.promisify(cb => fs.writeFile(filePath, fileContents, cb))();
}

async function getRepoUrl(cwd, opts) {
  if (opts.repoUrl) return opts.repoUrl;
  const project = await bolt.getProject({ cwd });
  if (
    project &&
    project.config.bolt &&
    project.config.bolt.releases &&
    project.config.bolt.releases.baseCommitUrl
  )
    return project.config.bolt.releases.baseCommitUrl;
  return '';
}

/**
 * @param {Object[]} listOfHistory
 * @param {string} listOfHistory[].release
 * @param {string} listOfHistory[].summary
 * @param {string[]} listOfHistory[].versions
 * @param {Object[]} listOfHistory[].commits
 * @param {string} listOfHistory[].commits[].message
 * @param {string} listOfHistory[].commits[].hash
 * @param {object} opts
 * @param {string} opts.prefix
 * @param {string} opts.path
 * The history object would looks like following
 * {
 *   summary: "This is a summary",
 *   doc: "release.md",
 *   releases: [
 *     '@atlaskit/code@minor'
 *   ],
 *   dependents: [
 *     '@atlaskit/badge@patch'
 *   ]
 * }
 */

function findUpdatedDependencies(pkgConfig, releases) {
  let packagesToBump = [];
  for (let depType of DEPENDENCY_TYPES) {
    let deps = pkgConfig[depType];
    if (!deps) continue;
    for (let release of releases) {
      if (deps[release.name]) packagesToBump.push(release);
    }
  }
  return packagesToBump;
}

async function updateChangelog(releaseObject, opts = { cwd: '', repoUrl: '' }) {
  const cwd = opts.cwd || process.cwd();
  const allPackages = await bolt.getWorkspaces({ cwd });
  const prefix = opts.prefix || '';
  const repoUrl = await getRepoUrl(cwd, opts);
  let udpatedChangelogs = [];
  // Updating ChangeLog files for each package
  for (let i = 0; i < releaseObject.releases.length; i++) {
    const release = releaseObject.releases[i];
    const pkg = allPackages.find(a => a.name === release.name);
    const updatedDeps = findUpdatedDependencies(
      pkg.config,
      releaseObject.releases,
    );
    if (!pkg)
      logger.warn(
        `While writing changelog, could not find workspace ${
          release.name
        } in project.`,
      );
    const changelogPath = path.join(pkg.dir, 'CHANGELOG.md');

    const templateString = `\n\n${generateMarkdownTemplate(
      release,
      releaseObject,
      updatedDeps,
      repoUrl,
    ).trim('\n')}\n`;
    try {
      if (fs.existsSync(changelogPath)) {
        await prependFile(changelogPath, templateString, pkg);
      } else {
        await writeFile(changelogPath, `# ${pkg.name}${templateString}`);
      }
    } catch (e) {
      logger.warn(e);
    }
    logger.log(`Updated file ${changelogPath}`);
    udpatedChangelogs.push(changelogPath);
  }
  return udpatedChangelogs;
}

async function prependFile(filePath, data, pkg) {
  const fileData = fs.readFileSync(filePath).toString();
  if (!fileData) {
    const completelyNewChangelog = `# ${pkg.name}${data}`;
    fs.writeFileSync(filePath, completelyNewChangelog);
    return;
  }
  const newChangelog = fileData.replace('\n', data);
  fs.writeFileSync(filePath, newChangelog);
}

module.exports = {
  updateChangelog,
};
