import { copyFixtureIntoTempDir } from 'jest-fixtures';
const bolt = require('bolt');
const path = require('path');
const runRelease = require('../../publish/publishCommand');
const versionCommand = require('../../version/versionCommand');
const createRelease = require('../../version/createRelease');
const cli = require('../../../utils/cli');
const git = require('../../../utils/git');
const fs = require('../../../utils/fs');
const isRunningInPipelines = require('../../../utils/isRunningInPipelines');
const logger = require('../../../utils/logger');
// avoid polluting test logs with error message in console
let consoleError = console.error;

jest.mock('../../../utils/cli');
jest.mock('../../../utils/git');
jest.mock('../../../utils/isRunningInPipelines');
jest.mock('../../changeset/parseChangesetCommit');
jest.mock('../../../utils/logger');

git.add.mockImplementation(() => Promise.resolve(true));
git.commit.mockImplementation(() => Promise.resolve(true));
git.push.mockImplementation(() => Promise.resolve(true));
git.tag.mockImplementation(() => Promise.resolve(true));
// we want to keep other bolt commands still running so our tests are more e2e
// NOTE: This is pretty terrible. Quite obviously bolt is not going to return these results
// each time, but there is only one test that uses the output of this function ('should add git tags')
// and we know this will be heavily refactored once its moved into the bolt org anyway. So we are happy
// to keep this debt in for now. LB takes full responsibility for this if it becomes flakey.
bolt.publish = jest.fn(() =>
  Promise.resolve([
    { name: 'pkg-a', newVersion: '1.1.0', published: true },
    { name: 'pkg-b', newVersion: '1.0.1', published: true },
  ]),
);

const simpleChangeset = {
  summary: 'This is a summary',
  releases: [{ name: 'pkg-a', type: 'minor' }],
  dependents: [],
  commit: 'b8bb699',
};

const simpleChangeset2 = {
  summary: 'This is a summary',
  releases: [
    { name: 'pkg-a', type: 'minor' },
    { name: 'pkg-b', type: 'patch' },
  ],
  dependents: [{ name: 'pkg-b', type: 'none', dependencies: [] }],
  commit: 'b8bb699',
};

const simpleReleaseObj = {
  releases: [{ name: 'pkg-a', commits: ['b8bb699'], version: '1.1.0' }],
  changesets: [
    {
      summary: 'This is a summary',
      releases: [{ name: 'pkg-a', type: 'minor' }],
      dependents: [],
      commit: 'b8bb699',
    },
  ],
};

const multipleReleaseObj = {
  releases: [
    { name: 'pkg-a', commits: ['b8bb699'], version: '1.1.0' },
    { name: 'pkg-b', commits: ['b8bb699'], version: '1.0.1' },
  ],
  changesets: [
    {
      summary: 'This is a summary',
      releases: [
        { name: 'pkg-a', type: 'minor' },
        { name: 'pkg-b', type: 'patch' },
      ],
      dependents: [],
      commit: 'b8bb699',
    },
  ],
};

describe('running release', () => {
  let cwd, pkgAConfigPath, pkgBConfigPath, pkgAChangelogPath, pkgBChangelogPath;

  beforeEach(async () => {
    cwd = await copyFixtureIntoTempDir(__dirname, 'simple-project');
    pkgAConfigPath = path.join(cwd, 'packages/pkg-a/package.json');
    pkgBConfigPath = path.join(cwd, 'packages/pkg-b/package.json');
    pkgAChangelogPath = path.join(cwd, 'packages/pkg-a/CHANGELOG.md');
    pkgBChangelogPath = path.join(cwd, 'packages/pkg-b/CHANGELOG.md');
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.error = consoleError;
  });

  describe('when runing in CI', () => {
    beforeEach(() => {
      isRunningInPipelines.mockReturnValueOnce(true);
    });

    describe('When there is no changeset commits', () => {
      // we make sure we still do this so that a later build can clean up after a previously
      // failed one (where the change was pushed back but not released and the next build has no
      // changeset commits)
      it('should still run bolt.publish', async () => {
        await runRelease({ cwd });

        expect(bolt.publish).toHaveBeenCalled();
      });
    });

    describe('When there is a changeset commit', () => {
      beforeEach(() => {
        git.getUnpublishedChangesetCommits.mockImplementationOnce(() =>
          Promise.resolve([simpleChangeset2]),
        );
      });

      it('should run bolt.publish', async () => {
        await runRelease({ cwd });

        expect(bolt.publish).toHaveBeenCalled();
      });

      it('should add git tags', async () => {
        await runRelease({ cwd });

        expect(git.tag).toHaveBeenCalledWith('pkg-a@1.1.0');
        expect(git.tag).toHaveBeenCalledWith('pkg-b@1.0.1');
        expect(git.push).toHaveBeenCalled();
      });
    });
  });
});
