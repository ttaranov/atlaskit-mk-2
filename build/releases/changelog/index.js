const { generateMarkdownTemplate } = require('./template');
const fs = require('fs');
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
async function updateChangeLog(releaseObject, opts) {
  const options = {
    prefix: opts.prefix || '',
    path: opts.path || __dirname,
  };

  // Updating ChangeLog files for each package
  for (let i = 0; i < releaseObject.releases.length; i++) {
    const release = releaseObject.releases[i];
    const targetFile = `${options.prefix}${release.name}.md`;

    release.dependent = releaseObject.dependents.find((d) => d.name === release.name);

    const templateString = `\n${generateMarkdownTemplate(release).trim('\n')}\n`;
    try {
      if (fs.existsSync(targetFile)) {
        await prependFile(templateString, targetFile);
      } else {
        await writeFile(targetFile, templateString);
      }
    } catch (e) {
      console.log(e);
    }
    console.log(`Updated file ${targetFile}`);
  }
}

/**
 * @param {string} data - Data string
 * @param {string} file - File path
 * The process is pretty general. It would create a temp file and write the data
 * into the file and then stream the existing file to the temp file. When it's done,
 * the temp file will be renamed to replace the existing file.
 */
async function prependFile(data, file) {
  let tempDir = os.tmpdir();
  tempDir = await mkdtemp(`${tempDir}${sep}`);
  const tempFile = `${tempDir}${sep}${file}`;
  return new Promise((resolve, reject) => {
    const oldFileStream = fs.createReadStream(file, { encoding: 'utf-8' });
    const newFileStream = fs.createWriteStream(tempFile);

    oldFileStream.on('error', (err) => {
      reject(new Error(`Failed to read file ${file}: ${err}`));
    });
    newFileStream.on('error', (err) => {
      reject(new Error(`Failed to write to temp file ${tempFile}: ${err}`));
    });
    newFileStream.on('finish', async () => {
      await rename(tempFile, file);
      resolve(`Finished writing ${file}`);
    });

    // Write the content to an empty temp file first
    // then stream the old file over
    newFileStream.write(data, () => {
      oldFileStream.pipe(newFileStream);
    });
  });
}

module.exports = {
  updateChangeLog,
};
