import { copyFixtureIntoTempDir } from 'jest-fixtures';
const bolt = require('bolt');
const path = require('path');
const runRelease = require('../../release').run;
const createRelease = require('../../changeset/createRelease');
const git = require('../../../utils/git');
const cli = require('../../../utils/cli');
const fs = require('../../../utils/fs');
const isRunningInPipelines = require('../../../utils/isRunningInPipelines');
const logger = require('../../../utils/logger');
jest.mock('../../../utils/cli', () => ({
  askConfirm: jest.fn(),
}));

jest.mock('../../../utils/git');

jest.mock('../../../utils/isRunningInPipelines');
jest.mock('../../changeset/parseChangesetCommit');
jest.mock('../../../utils/logger');

git.add.mockImplementation(() => Promise.resolve(true));
git.commit.mockImplementation(() => Promise.resolve(true));
git.push.mockImplementation(() => Promise.resolve(true));
bolt.publish = jest.fn();

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('in a simple project', () => {
    describe('when there are no changeset commits', () => {
      beforeEach(() => {
        git.getUnpublishedChangesetCommits.mockImplementation(() =>
          Promise.resolve([]),
        );
      });

      it('should warn if no changeset commits exist', async () => {
        await runRelease({ cwd });
        const loggerWarnCalls = logger.warn.mock.calls;
        expect(loggerWarnCalls.length).toEqual(1);
        expect(loggerWarnCalls[0][0]).toEqual(
          'No unreleased changesets found. Exiting',
        );
      });
    });

    describe('when there are changeset commits', () => {
      // From here, we'll just mock from createRelease and ignore all the git operations (getUnpublishedChangesetCommits, etc)
      beforeAll(() => {
        // We just need there to be a length > 0
        git.getUnpublishedChangesetCommits.mockImplementation(() =>
          Promise.resolve([simpleChangeset, simpleChangeset2]),
        );
      });

      it('should bump releasedPackages', async () => {
        cli.askConfirm.mockReturnValueOnce(Promise.resolve(true));
        const spy = jest.spyOn(fs, 'writeFile');

        await runRelease({ cwd });
        const calls = spy.mock.calls;
        expect(JSON.parse(calls[0][1])).toEqual(
          expect.objectContaining({ name: 'pkg-a', version: '1.1.0' }),
        );
        expect(JSON.parse(calls[1][1])).toEqual(
          expect.objectContaining({ name: 'pkg-b', version: '1.0.1' }),
        );
      });

      it('should bump multiple released packages if required', async () => {
        cli.askConfirm.mockReturnValueOnce(Promise.resolve(true));
        const spy = jest.spyOn(fs, 'writeFile');
        await runRelease({ cwd });
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

      describe('if not running in CI', () => {
        beforeEach(() => {
          isRunningInPipelines.mockReturnValueOnce(false);
        });

        it('should ask for user confirmation if not running in CI', async () => {
          cli.askConfirm.mockReturnValueOnce(Promise.resolve(true));

          await runRelease({ cwd });

          const confirmationCalls = cli.askConfirm.mock.calls;
          expect(confirmationCalls.length).toEqual(1);
          expect(confirmationCalls[0][0]).toEqual('Publish these packages?');
        });

        it('should run publish if user confirms', async () => {
          cli.askConfirm.mockReturnValueOnce(Promise.resolve(true));

          await runRelease({ cwd });

          expect(bolt.publish).toHaveBeenCalled();
        });
        it('should git add the expected files', async () => {
          cli.askConfirm.mockReturnValueOnce(Promise.resolve(true));
          git.getUnpublishedChangesetCommits.mockReturnValueOnce([
            simpleChangeset2,
          ]);
          await runRelease({ cwd });
          const mocks = git.add.mock.calls;

          // First two are adding the package.json actual versions
          expect(mocks[0]).toEqual([pkgAConfigPath]);
          expect(mocks[1]).toEqual([pkgBConfigPath]);
          // Next two bump changelogs
          expect(mocks[2]).toEqual([pkgAChangelogPath]);
          expect(mocks[3]).toEqual([pkgBChangelogPath]);
          // Last is update package.json for A after its B dependency is bumped.
          expect(mocks[4]).toEqual([pkgAConfigPath]);
        });

        it("should not run publish if user  doesn't confirm", async () => {
          cli.askConfirm.mockReturnValueOnce(Promise.resolve(false));
          git.getUnpublishedChangesetCommits.mockReturnValueOnce([
            simpleChangeset2,
          ]);

          await runRelease({ cwd });
          expect(bolt.publish).not.toHaveBeenCalled();
        });
      });

      describe('if running in CI', () => {
        beforeEach(() => {
          isRunningInPipelines.mockReturnValueOnce(true);
          git.getUnpublishedChangesetCommits.mockReturnValueOnce([
            simpleChangeset2,
          ]);
        });

        it('should not ask for user confirmation', async () => {
          await runRelease({ cwd });

          const confirmationCalls = cli.askConfirm.mock.calls;
          expect(confirmationCalls.length).toEqual(0);
        });

        it('should run bolt.publish', async () => {
          await runRelease({ cwd });

          expect(bolt.publish).toHaveBeenCalled();
        });
      });
    });
  });
});
