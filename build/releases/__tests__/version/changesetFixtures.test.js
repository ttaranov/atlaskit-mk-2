import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as path from 'path';
import createChangeset from '../../changeset/createChangeset';

const cli = require('../../../utils/cli');
jest.mock('../../../utils/cli');
jest.mock('../../../utils/logger');

function assertPackagesPrompt(options) {
  const askPackagesCalls = cli.askCheckbox.mock.calls;
  expect(askPackagesCalls.length).toEqual(1);
  expect(askPackagesCalls[0][0]).toEqual(
    'Which packages would you like to include?',
  );
  expect(askPackagesCalls[0][1]).toEqual(options);
}

function assertBumpTypePrompts(expectedCalls) {
  const bumpTypeCalls = cli.askList.mock.calls;
  expect(bumpTypeCalls.length).toEqual(expectedCalls.length);
  for (let i = 0; i < expectedCalls.length; i += 1) {
    expect(bumpTypeCalls[i][0]).toEqual(
      `What kind of change is this for ${chalk.green(expectedCalls[i])}?`,
    );
  }
}

function assertSummaryPrompt() {
  const summaryCalls = cli.askQuestion.mock.calls;
  expect(summaryCalls.length).toEqual(1);
  expect(summaryCalls[0][0]).toEqual('Summary');
}

function mockUserInput(releases, dependents, summary) {
  const pkgsToRelease = releases.map(pkg => pkg.name);
  // select which packages user wants to release
  cli.askCheckbox.mockReturnValueOnce(Promise.resolve(pkgsToRelease));

  // select release types for each package
  releases.forEach(release => {
    cli.askList.mockReturnValueOnce(Promise.resolve(release.type));
  });

  // type the summary
  cli.askQuestion.mockReturnValueOnce(Promise.resolve(summary));

  // select release type for each dependent
  dependents.forEach(dependent => {
    cli.askList.mockReturnValueOnce(Promise.resolve(dependent.type));
  });
}

describe('createChangeset', () => {
  let aWorkspacesDir;
  let bWorkspacesDir;
  let cWorkspacesDir;
  let cwd;

  const summary = 'This is a summary';

  describe('dependencies of different versions', async () => {
    beforeEach(async () => {
      cwd = await copyFixtureIntoTempDir(__dirname, 'interlinked-dependencies');
      aWorkspacesDir = path.join(cwd, 'packages', 'a');
      bWorkspacesDir = path.join(cwd, 'packages', 'b');
      cWorkspacesDir = path.join(cwd, 'packages', 'c');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should re-ask when a dependency needs an update', async () => {
      const releases = [{ name: 'pkg-a', type: 'minor' }];
      const dependents = [
        { name: 'pkg-b', type: 'none' },
        { name: 'pkg-c', type: 'patch' },
        { name: 'pkg-a', type: 'patch' },
        { name: 'pkg-b', type: 'patch' },
      ];
      mockUserInput(releases, dependents, summary);
      const changeset = await createChangeset(['pkg-a'], { cwd });

      expect(changeset).toEqual({
        summary: 'This is a summary',
        releases: [{ name: 'pkg-a', type: 'minor' }],
        dependents: [
          { name: 'pkg-b', dependencies: ['pkg-a', 'pkg-c'], type: 'patch' },
          { name: 'pkg-c', dependencies: ['pkg-a'], type: 'patch' },
          { name: 'pkg-a', dependencies: ['pkg-b'], type: 'patch' },
        ],
      });
    });
    it('should have correct prompt list', async () => {
      const releases = [{ name: 'pkg-a', type: 'minor' }];
      const dependents = [
        { name: 'pkg-b', type: 'none' },
        { name: 'pkg-c', type: 'patch' },
        { name: 'pkg-a', type: 'patch' },
        { name: 'pkg-b', type: 'patch' },
      ];
      mockUserInput(releases, dependents, summary);
      const changeset = await createChangeset(['pkg-a'], { cwd });

      // expect(cli.askList.mock.calls.length).toEqual(5);

      // the second and last of these relate to pkg-b and are the most relevant
      // The others are tested to ensure the test's slightly flakey dependency
      // on how the packages are pulled in is maintained.
      expect(cli.askList.mock.calls[0]).toEqual([
        'What kind of change is this for pkg-a?',
        ['patch', 'minor', 'major'],
      ]);
      expect(cli.askList.mock.calls[1]).toEqual([
        'What kind of change is this for pkg-b?',
        ['none', 'patch', 'minor', 'major'],
      ]);
      expect(cli.askList.mock.calls[2]).toEqual([
        'What kind of change is this for pkg-c?',
        ['none', 'patch', 'minor', 'major'],
      ]);
      expect(cli.askList.mock.calls[3]).toEqual([
        'What kind of change is this for pkg-a?',
        ['none', 'patch', 'minor', 'major'],
      ]);
      expect(cli.askList.mock.calls[4]).toEqual([
        'What kind of change is this for pkg-b?',
        ['patch', 'minor', 'major'],
      ]);
    });
    it('should only ask b once if it does not need an update', async () => {
      const releases = [{ name: 'pkg-a', type: 'minor' }];

      // If everything is valid, no questions are asked again
      const dependents = [
        { name: 'pkg-b', type: 'none' },
        { name: 'pkg-c', type: 'none' },
        { name: 'pkg-a', type: 'patch' },
      ];
      mockUserInput(releases, dependents, summary);
      const changeset = await createChangeset(['pkg-a'], { cwd });

      expect(cli.askList.mock.calls.length).toEqual(4);
    });
  });

  describe('project with 0.x packages', () => {
    beforeEach(async () => {
      cwd = await copyFixtureIntoTempDir(
        __dirname,
        'interlinked-dependencies-with-0x-versions',
      );
      aWorkspacesDir = path.join(cwd, 'packages', 'a');
      bWorkspacesDir = path.join(cwd, 'packages', 'b');
      cWorkspacesDir = path.join(cwd, 'packages', 'c');
    });

    it('should not allow "none" for caret or tilde deps on 0.x ranges', async () => {
      const releases = [{ name: 'pkg-a', type: 'minor' }];

      // If everything is valid, no questions are asked again
      const dependents = [
        { name: 'pkg-b', type: 'patch' },
        { name: 'pkg-c', type: 'patch' },
        { name: 'pkg-a', type: 'patch' },
      ];
      mockUserInput(releases, dependents, summary);
      const changeset = await createChangeset(['pkg-a'], { cwd });

      // First call is for bump of pkg-a (the package we are releasing)
      expect(cli.askList.mock.calls[0]).toEqual([
        'What kind of change is this for pkg-a?',
        ['patch', 'minor', 'major'],
      ]);
      // second and third are for dependents (should have no "none" choice)
      expect(cli.askList.mock.calls[1]).toEqual([
        'What kind of change is this for pkg-b?',
        ['patch', 'minor', 'major'],
      ]);
      expect(cli.askList.mock.calls[2]).toEqual([
        'What kind of change is this for pkg-c?',
        ['patch', 'minor', 'major'],
      ]);
      // last is for pkg-a as a dependent (should be allowed to select none as not a caret dep)
      expect(cli.askList.mock.calls[3]).toEqual([
        'What kind of change is this for pkg-a?',
        ['none', 'patch', 'minor', 'major'],
      ]);
    });
  });
});
