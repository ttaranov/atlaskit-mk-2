import { copyFixtureIntoTempDir } from 'jest-fixtures';
const bolt = require('bolt');
const path = require('path');
const versionCommand = require('../../version/versionCommand');
const git = require('../../../utils/git');
const fs = require('../../../utils/fs');
const logger = require('../../../utils/logger');
// avoid polluting test logs with error message in console
let consoleError = console.error;

jest.mock('../../../utils/cli');
jest.mock('../../../utils/git');
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

const mockNoChangesetCommits = () => {
  mockUnpublishedChangesetCommits([]);
};

const mockUnpublishedChangesetCommits = commits => {
  git.getUnpublishedChangesetCommits.mockImplementationOnce(() =>
    Promise.resolve(commits),
  );
};

describe('running version in a simple project', () => {
  let cwd;

  beforeEach(async () => {
    cwd = await copyFixtureIntoTempDir(__dirname, 'simple-project');
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.error = consoleError;
  });

  describe('when there are no changeset commits', () => {
    it('should warn if no changeset commits exist', async () => {
      mockNoChangesetCommits();
      await versionCommand({ cwd });
      const loggerWarnCalls = logger.warn.mock.calls;
      expect(loggerWarnCalls.length).toEqual(1);
      expect(loggerWarnCalls[0][0]).toEqual(
        'No unreleased changesets found, exiting.',
      );
    });
  });

  describe('When there is a changeset commit', () => {
    it('should bump releasedPackages', async () => {
      const spy = jest.spyOn(fs, 'writeFile');
      mockUnpublishedChangesetCommits([simpleChangeset2]);

      await versionCommand({ cwd });
      const calls = spy.mock.calls;

      expect(JSON.parse(calls[0][1])).toEqual(
        expect.objectContaining({ name: 'pkg-a', version: '1.1.0' }),
      );
      expect(JSON.parse(calls[1][1])).toEqual(
        expect.objectContaining({ name: 'pkg-b', version: '1.0.1' }),
      );
    });

    it('should git add the expected files (without changelog)', async () => {
      mockUnpublishedChangesetCommits([simpleChangeset2]);
      await versionCommand({ cwd });

      const mocks = git.add.mock.calls;
      const pkgAConfigPath = path.join(cwd, 'packages/pkg-a/package.json');
      const pkgBConfigPath = path.join(cwd, 'packages/pkg-b/package.json');

      // First two are adding the package.json actual versions
      expect(mocks[0]).toEqual([pkgAConfigPath]);
      expect(mocks[1]).toEqual([pkgBConfigPath]);
      // Next is update package.json for A after its B dependency is bumped.
      expect(mocks[2]).toEqual([pkgAConfigPath]);
    });

    it('should git add the expected files (with changelog)', async () => {
      mockUnpublishedChangesetCommits([simpleChangeset2]);
      await versionCommand({ cwd, changelogs: true });
      const mocks = git.add.mock.calls;
      const pkgAChangelogPath = path.join(cwd, 'packages/pkg-a/CHANGELOG.md');
      const pkgBChangelogPath = path.join(cwd, 'packages/pkg-b/CHANGELOG.md');

      // First two are adding the package.json actual versions
      // Next is update package.json for A after its B dependency is bumped.
      // Final two bump changelogs
      expect(mocks[3]).toEqual([pkgAChangelogPath]);
      expect(mocks[4]).toEqual([pkgBChangelogPath]);
    });
  });

  describe('when there are multiple changeset commits', () => {
    it('should bump releasedPackages', async () => {
      mockUnpublishedChangesetCommits([simpleChangeset, simpleChangeset2]);
      const spy = jest.spyOn(fs, 'writeFile');

      await versionCommand({ cwd });
      const calls = spy.mock.calls;
      expect(JSON.parse(calls[0][1])).toEqual(
        expect.objectContaining({ name: 'pkg-a', version: '1.1.0' }),
      );
      expect(JSON.parse(calls[1][1])).toEqual(
        expect.objectContaining({ name: 'pkg-b', version: '1.0.1' }),
      );
    });

    it('should bump multiple released packages if required', async () => {
      mockUnpublishedChangesetCommits([simpleChangeset, simpleChangeset2]);
      const spy = jest.spyOn(fs, 'writeFile');
      await versionCommand({ cwd });
      const calls = spy.mock.calls;

      // first call should be minor bump
      expect(JSON.parse(calls[0][1])).toEqual(
        expect.objectContaining({
          name: 'pkg-a',
          version: '1.1.0',
        }),
      );
      // second should be a patch
      expect(JSON.parse(calls[1][1])).toEqual(
        expect.objectContaining({
          name: 'pkg-b',
          version: '1.0.1',
        }),
      );
    });
  });
});
