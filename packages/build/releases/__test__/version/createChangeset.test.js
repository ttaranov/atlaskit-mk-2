const chalk = require('chalk');
const pyarn = require('pyarn');
const createChangeset = require('../../version/createChangeset');
const cli = require('../../../utils/cli');

jest.mock('../../../utils/cli');
jest.mock('../../../utils/logger');
jest.mock('pyarn');

function assertPackagesPrompt(options) {
  const askPackagesCalls = cli.askCheckbox.mock.calls;
  expect(askPackagesCalls.length).toEqual(1);
  expect(askPackagesCalls[0][0]).toEqual('Which packages would you like to include?');
  expect(askPackagesCalls[0][1]).toEqual(options);
}

function assertBumpTypePrompts(expectedCalls) {
  const bumpTypeCalls = cli.askList.mock.calls;
  expect(bumpTypeCalls.length).toEqual(expectedCalls.length);
  for (let i = 0; i < expectedCalls.length; i += 1) {
    expect(bumpTypeCalls[i][0]).toEqual(`What kind of change is this for ${chalk.green(expectedCalls[i])}?`);
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
  let cwd;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('in a simple project', () => {
    /**
     * Just two packages pgk-a and pkg-b with no depencies between them
    */
    const dependentsGraph = [['pkg-a', []], ['pkg-b', []]];
    const releases = [{ name: 'pkg-a', type: 'minor' }];
    const dependents = [];
    const summary = 'This is a summary';

    beforeEach(async () => {
      mockUserInput(releases, dependents, summary);
      pyarn.getDependentsGraph.mockReturnValueOnce(Promise.resolve(new Map(dependentsGraph)));
    });

    it('should prompt for changed packages, bump type and summary', async () => {
      const changedPackages = ['pkg-a'];
      await createChangeset(changedPackages, { cwd });

      assertPackagesPrompt(changedPackages);
      assertBumpTypePrompts(['pkg-a']);
      assertSummaryPrompt();
    });

    it('should create expected changeset object', async () => {
      const changedPackages = ['pkg-a'];
      const changeset = await createChangeset(changedPackages, { cwd });

      expect(changeset).toEqual({
        summary: 'This is a summary',
        releases: [{ name: 'pkg-a', type: 'minor' }],
        dependents: [],
      });
    });
  });

  describe('in a project with dependencies', () => {
    /**
     * Scenario: two packages: pkg-a, pkg-b. pkg-b depends on pkg-a
     */
    const dependentsGraph = [['pkg-a', ['pkg-b']], ['pkg-b', []]];
    const releases = [{ name: 'pkg-a', type: 'minor' }];
    const dependents = [{ name: 'pkg-b', type: 'patch' }];
    const summary = 'This is a summary';

    beforeEach(async () => {
      mockUserInput(releases, dependents, summary);
      pyarn.getDependentsGraph.mockReturnValueOnce(Promise.resolve(new Map(dependentsGraph)));
    });

    it('should prompt for changed packages, bump type and summary', async () => {
      const changedPackages = ['pkg-a'];
      await createChangeset(changedPackages, { cwd });

      assertPackagesPrompt(changedPackages);
      // Should ask for bump type for both packages as b is a dependency
      assertBumpTypePrompts(['pkg-a', 'pkg-b']);
      assertSummaryPrompt();
    });

    it('should create expected changeset object', async () => {
      const changedPackages = ['pkg-a'];
      const changeset = await createChangeset(changedPackages, { cwd });

      expect(changeset).toEqual({
        summary: 'This is a summary',
        releases: [{ name: 'pkg-a', type: 'minor' }],
        dependents: [{ name: 'pkg-b', dependencies: ['pkg-a'], type: 'patch' }],
      });
    });
  });

  describe('in a project with transitive dependencies', () => {
    /**
     * Scenario: thee packages: pkg-a, pkg-b, pkg-c.
     * pkg-b depends on pkg-a
     * pkg-c depends on pkg-b
     * pkg-a depends on pkg-a
     *
     * So, bumping a should cause a, b and c to bump dependencies
     */
    const dependentsGraph = [['pkg-a', ['pkg-b']], ['pkg-b', ['pkg-c']], ['pkg-c', ['pkg-a']]];
    const releases = [{ name: 'pkg-a', type: 'minor' }];
    const dependents = [
      { name: 'pkg-b', type: 'patch' },
      { name: 'pkg-c', type: 'patch' },
      { name: 'pkg-a', type: 'patch' },
    ];
    const summary = 'This is a summary';

    beforeEach(async () => {
      mockUserInput(releases, dependents, summary);
      pyarn.getDependentsGraph.mockReturnValueOnce(Promise.resolve(new Map(dependentsGraph)));
    });

    it('should prompt for changed packages, bump type and summary', async () => {
      const changedPackages = ['pkg-a'];
      await createChangeset(changedPackages, { cwd });

      assertPackagesPrompt(['pkg-a']);
      // Will ask 4 times, one for release and 3 for dependents
      assertBumpTypePrompts(['pkg-a', 'pkg-b', 'pkg-c', 'pkg-a']);
      assertSummaryPrompt();
    });

    it('should create expected changeset object', async () => {
      const changedPackages = ['pkg-a'];
      const changeset = await createChangeset(changedPackages, { cwd });

      expect(changeset).toEqual({
        summary: 'This is a summary',
        releases: [{ name: 'pkg-a', type: 'minor' }],
        dependents: [
          { name: 'pkg-b', dependencies: ['pkg-a'], type: 'patch' },
          { name: 'pkg-c', dependencies: ['pkg-b'], type: 'patch' },
          { name: 'pkg-a', dependencies: ['pkg-c'], type: 'patch' },
        ],
      });
    });
  });
});
