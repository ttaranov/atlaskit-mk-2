const { generateMarkdownTemplate } = require('./template');
const fs = require('fs');
const bolt = require('bolt');
const path = require('path');
const os = require('os');
const util = require('util');
const { sep } = require('path');

function writeFile(filePath, fileContents) {
  return util.promisify(cb => fs.writeFile(filePath, fileContents, cb))();
}

function rename(oldPath, newPath) {
  return util.promisify(cb => fs.rename(oldPath, newPath, cb))();
}

function mkdtemp(prefix) {
  return util.promisify(cb => fs.mkdtemp(prefix, cb))();
}

async function getRepoUrl(cwd, opts) {
  if (opts.repoUrl) return opts.repoUrl;
  const project = await bolt.getProject({ cwd });
  if (
    project &&
    project.config['bolt-changelog'] &&
    project.config['bolt-changelog'].repositoryUrl
  )
    return project.config['bolt-changelog'].repositoryUrl;
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

async function updateChangeLog(releaseObject, opts = { cwd: '', repoUrl: '' }) {
  const cwd = opts.cwd || process.cwd();
  const allPackages = await bolt.getWorkspaces({ cwd });
  const prefix = opts.prefix || '';
  const repoUrl = await getRepoUrl(cwd, opts);
  let udpatedChangelogs = [];
  // Updating ChangeLog files for each package
  for (let i = 0; i < releaseObject.releases.length; i++) {
    const release = releaseObject.releases[i];
    const pkg = allPackages.find(a => a.name === release.name);
    if (!pkg)
      throw new Error(
        `While writing changelog, could not find workspace ${
          release.name
        } in project.`,
      );
    const changelogPath = path.join(pkg.dir, 'CHANGELOG.md');

    const templateString = `\n\n${generateMarkdownTemplate(
      release,
      releaseObject,
      repoUrl,
    ).trim('\n')}\n`;
    try {
      if (fs.existsSync(changelogPath)) {
        await prependFile(changelogPath, templateString, pkg);
      } else {
        await writeFile(changelogPath, `# ${pkg.name}${templateString}`);
      }
    } catch (e) {
      console.log(e);
    }
    console.log(`Updated file ${changelogPath}`);
    udpatedChangelogs.push(changelogPath);
  }
  return udpatedChangelogs;
}

/**
 * @param {string} filePath - File path
 * @param {string} data - Data string
 * The process is pretty general. It would create a temp file and write the data
 * into the file and then stream the existing file to the temp file. When it's done,
 * the temp file will be renamed to replace the existing file.
 */
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
  updateChangeLog,
};
