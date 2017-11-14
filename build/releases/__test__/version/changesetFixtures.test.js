import { copyFixtureIntoTempDir } from 'jest-fixtures';
import * as path from 'path';
import createChangeset from '../../changeset/createChangeset';

const cli = require('../../../utils/cli');
jest.mock('../../../utils/cli');
jest.mock('../../../utils/logger');

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
  describe('dependencies of different versions', async () => {
    let aWorkspacesDir;
    let bWorkspacesDir;
    let cWorkspacesDir;
    let cwd;

    const summary = 'This is a summary';


    beforeEach(async () => {
      cwd = await copyFixtureIntoTempDir(
        __dirname,
        'interlinked-dependencies'
      );
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
      mockUserInput(releases,dependents,summary)
      const changeset = await createChangeset(['pkg-a'], { cwd })

      expect(changeset).toEqual({
        summary: 'This is a summary',
        releases: [{ name: 'pkg-a', type: 'minor' }],
        dependents: [
          { name: 'pkg-b', dependencies: ['pkg-a', 'pkg-c'], type: 'patch' },
          { name: 'pkg-c', dependencies: ['pkg-a'], type: 'patch' },
          { name: 'pkg-a', dependencies: ['pkg-b'], type: 'patch' },
        ],
      })
    });
    it('should have correct prompt list', async () => {
      const releases = [{ name: 'pkg-a', type: 'minor' }];
      const dependents = [
        { name: 'pkg-b', type: 'none' },
        { name: 'pkg-c', type: 'patch' },
        { name: 'pkg-a', type: 'patch' },
        { name: 'pkg-b', type: 'patch' },
      ];
      mockUserInput(releases,dependents,summary)
      const changeset = await createChangeset(['pkg-a'], { cwd })

      // expect(cli.askList.mock.calls.length).toEqual(5);

      // the second and last of these relate to pkg-b and are the most relevant
      // The others are tested to ensure the test's slightly flakey dependency
      // on how the packages are pulled in is maintained.
      expect(cli.askList.mock.calls[0]).toEqual(
        ['What kind of change is this for \u001b[32mpkg-a\u001b[39m?', ['patch', 'minor', 'major']]
      )
      expect(cli.askList.mock.calls[1]).toEqual(
        ['What kind of change is this for \u001b[32mpkg-b\u001b[39m?', ['none', 'patch', 'minor', 'major']]
      )
      expect(cli.askList.mock.calls[2]).toEqual(
        ['What kind of change is this for \u001b[32mpkg-c\u001b[39m?', ['none', 'patch', 'minor', 'major']]
      )
      expect(cli.askList.mock.calls[3]).toEqual(
        ['What kind of change is this for \u001b[32mpkg-a\u001b[39m?', ['none', 'patch', 'minor', 'major']]
      )
      expect(cli.askList.mock.calls[4]).toEqual(
        ['What kind of change is this for \u001b[32mpkg-b\u001b[39m?', ['patch', 'minor', 'major']]
      )
    });
    it('should only ask b once if it does not need an update', async () => {
      const releases = [{ name: 'pkg-a', type: 'minor' }];

      // If everything is valid, no questions are asked again
      const dependents = [
        { name: 'pkg-b', type: 'none' },
        { name: 'pkg-c', type: 'none' },
        { name: 'pkg-a', type: 'patch' },
      ];
      mockUserInput(releases,dependents,summary)
      const changeset = await createChangeset(['pkg-a'], { cwd })

      expect(cli.askList.mock.calls.length).toEqual(4);
    });

  });
});
