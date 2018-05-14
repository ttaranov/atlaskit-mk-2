// @flow
const bolt = require('bolt');
const fs = require('fs');
const axios = require('axios');
const { promisify } = require('util');
const chalk = require('chalk');
const notFoundContributor = require('./src/404Contributors.json');
const getContributors = require('./src/get-git-committers');
const allContributors = require('./src/allContributors.json');

const writeFile = promisify(fs.writeFile);

/*::
type _404ContributorType = {
  [string]: boolean
}
*/

async function asyncForEach(arr, callback) {
  for (const key of arr) {
    await callback(key);
  }
}

async function createContributers() {
  console.log(chalk.yellow`⚖️ Updating Atlaskit contributors`);
  let contributorInformation = new Set();
  let _404Contributor /*: _404ContributorType*/ = {};
  let newContributors = {};
  const workspaces = await bolt.getWorkspaces();
  const workspacesDirs = workspaces.map(ws => ws.dir);
  const contributerToRepository = await getContributors([
    'shortlog',
    '-s',
    '-e',
  ]);

  contributerToRepository.split('\n').forEach(contributor => {
    contributorInformation.add(contributor.replace(/(.*\<)/, '').slice(0, -1));
  });

  await asyncForEach(contributorInformation.keys(), async contributorEmail => {
    let isNewContributer = !allContributors[contributorEmail];
    if (isNewContributer && !notFoundContributor[contributorEmail]) {
      try {
        const { data } = await axios(
          `https://api.bitbucket.org/2.0/users/${contributorEmail}`,
        );
        newContributors[contributorEmail] = {
          name: data.display_name,
          avatar: data.links.avatar.href,
          email: contributorEmail,
        };
      } catch (err) {
        console.log(
          `Failed to load information for ${contributorEmail} due to ${err}`,
        );
        _404Contributor[contributorEmail] = true;
      }
    }
  });

  if (Object.keys(newContributors).length !== 0) {
    await writeFile(
      `${__dirname}/src/allContributors.json`,
      JSON.stringify({ ...allContributors, ...newContributors }, null, 2),
    );
  }

  if (Object.keys(_404Contributor).length !== 0) {
    await writeFile(
      `${__dirname}/src/404Contributors.json`,
      JSON.stringify({ ...notFoundContributor, ..._404Contributor }, null, 2),
    );
  }

  console.log(chalk.green`🖌 Updated Atlaskit contributors`);
  console.log(chalk.yellow`⚖️ Updating contributors in each component`);

  await asyncForEach(workspacesDirs, async ws => {
    let contributionInWSWithDetails = [];
    const contributorInWs = await getContributors([
      'shortlog',
      '-n',
      '-s',
      '-e',
      ws,
    ]);
    const contributorInWsEmails = contributorInWs
      .split('\n')
      .map(contributor => contributor.replace(/(.*\<)/, '').slice(0, -1))
      .filter(contributorEmail => !notFoundContributor[contributorEmail])
      .map(contributor => allContributors[contributor]);
    writeFile(
      `${ws}/CONTRIBUTORS`,
      JSON.stringify(contributorInWsEmails, null, 2),
    );
  });
}

createContributers();
