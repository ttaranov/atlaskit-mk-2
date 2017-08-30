const template = require('./templates');
const example = require('./examples/3combo');
const fs = require('fs');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const rename = util.promisify(fs.rename);

/**
 * 
 * @param {Object[]} listOfHistory 
 * @param {string} listOfHistory[].release
 * @param {string} listOfHistory[].summary
 * @param {string[]} listOfHistory[].versions
 * @param {Object[]} listOfHistory[].commits
 * @param {string} listOfHistory[].commits[].message
 * @param {string} listOfHistory[].commits[].hash
 * 
 * @param {object} opts
 * @param {string} opts.prefix
 * The history object would looks like following
 * {
 *   release: "release.md",
 *   summary: "This is a summary",
 *   versions: [
 *     package-1@minor
 *   ],
 *   commits: [
 *     {
 *        message: 'commit message 1',
 *        hash: 'xxxxxx'
 *     },
 *     {
 *        message: 'commit messsage 2',
 *        hash: 'yyyyyyyy'
 *     }
 *   ]
 * }
 */
async function main(listOfHistory, opts) {
  opts = {
    prefix: opts.prefix || '',
    path: opts.path || __dirname,
  }
  const packageMap = groupByPackage(listOfHistory);
  for (let [_, package] of packageMap) {
    const targetFile = `${opts.prefix}${package.name}.md`;
    const templateString = '\n' + template(package).trim('\n') + '\n';
    try {
      if (fs.existsSync(targetFile)) {
        await prependFile(templateString, targetFile);
      } else {
        await writeFile(targetFile, templateString);
      }
    } catch(e) {
      console.log(e);
    }
    console.log(`Updated file ${targetFile}`);
  }
};

/**
 * 
 * @param {string} data - Data string
 * @param {string} file - File path
 * The process is pretty general. It would create a temp file and write the data
 * into the file and then stream the existing file to the temp file. When it's done,
 * the temp file will be renamed to replace the existing file.
 */
async function prependFile(data, file) {
  return new Promise((resolve, reject) => {
    const tempFile = `${file}.temp`;
    const oldFileStream = fs.createReadStream(file, { encoding: 'utf-8' });
    const newFileStream = fs.createWriteStream(tempFile);

    oldFileStream.on('error', (err) => {
      reject(`Failed to read file ${file}: ${err}`);
    });
    newFileStream.on('error', (err) => {
      reject(`Failed to write to temp file ${tempFile}: ${err}`);
    });
    newFileStream.on('finish', async () => {
      await rename(tempFile, file);
      resolve(`Finished writing ${file}`);
    })

    // Write the content to an empty temp file first
    // then stream the old file over
    newFileStream.write(data, () => {
      oldFileStream.pipe(newFileStream);
    });
  });
}

function groupByPackage(listOfHistory) {
  return listOfHistory.reduce((map, history) => {
    history.versions.forEach((element) => {
      const [ name, version ] = element.split('@');
      const package = map.get(name) || {
        name,
        releases: [],
        summaries: [],
        commits: [],
      };
      if (history.summary && history.summary.length > 0) {
        package.summaries.push({
          message: history.summary,
          commits: history.commits.map(e => e.hash),
          version,
          doc: history.release,
        })
      } else {
        if (history.release && history.release.length > 0) {
          // If there is no summary section but a release doc section
          package.summaries.push({
            message: 'Release summary',
            version,
            doc: history.release,
          });
        } 
        const commitWithVersion = history.commits.map((e) => {
          return {
            ...e,
            version,
          }
        })
        package.commits = package.commits.concat(commitWithVersion);
      }
      package.version = require(`../../../components/${name}/package.json`).version;
      map.set(name, package);
    });
    return map;
  }, new Map());
}

module.exports = main;