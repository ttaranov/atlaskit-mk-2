const fs = require('fs');
const path = require('path');

function createNewReleaseDoc(fileName, summary) {
  const cwd = process.cwd();
  const newFilePath = path.join(cwd, 'releases', fileName);

  const newReleaseTemplate = `# New release

${summary}

You can add whatever information you need to about this release. Try to mention:

* Which packages are affected
* What the breaking changes were
* Reasons for these
* Code samples for upgrading
* Any relevant links to issues, discussions, etc

`;
  fs.writeFileSync(newFilePath, newReleaseTemplate);

  return path.relative(cwd, newFilePath);
}

module.exports = createNewReleaseDoc;
