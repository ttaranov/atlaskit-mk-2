const template = require('./templates');
const example = require('./examples/3combo');
const fs = require('fs');

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
function main(listOfHistory, opts) {
  opts = {
    prefix: opts.prefix || '',
    path: opts.path || __dirname,
  }
  const packageMap = groupByPackage(listOfHistory);
  packageMap.forEach((package) => {
    const templateString = template(package);
    fs.writeFile(`${opts.prefix}${package.name}.md`, templateString, (err) => {
      if (err) throw err;
      console.log(`The ${opts.prefix}${package.name}.md has been saved!`);
    });
  });
};

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