// @flow
import { copyFixtureIntoTempDir } from 'jest-fixtures';
import { changesetCommand } from '../../changeset';
import { getChangedPackagesSinceMaster } from '@atlaskit/build-utils/packages';
import createChangesetCommit from '../../changeset/createChangesetCommit';
import {
  askCheckboxPlus,
  askList,
  askConfirm,
  askQuestion,
} from '@atlaskit/build-utils/cli';
import fs from 'fs';

jest.mock('@atlaskit/build-utils/logger');
jest.mock('@atlaskit/build-utils/cli');
jest.mock('@atlaskit/build-utils/packages');
jest.mock('@atlaskit/build-utils/git');
jest.mock('../../changeset/createChangesetCommit');

getChangedPackagesSinceMaster.mockReturnValue([]);

const mockUserResponses = mockResponses => {
  const summary = mockResponses.summary || 'summary message mock';
  const shouldCommit = mockResponses.shouldCommit || 'n';
  askCheckboxPlus.mockReturnValueOnce(Object.keys(mockResponses.releases));
  Object.entries(mockResponses.releases).forEach(([pkg, type]) =>
    askList.mockReturnValueOnce(type),
  );
  askQuestion.mockReturnValueOnce(summary);
  askConfirm.mockReturnValueOnce(shouldCommit);
};

describe('making them changesets', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate changeset to patch a single package', async () => {
    const cwd = await copyFixtureIntoTempDir(__dirname, 'simple-project');
    mockUserResponses({ releases: { 'pkg-a': 'patch' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'pkg-a', type: 'patch' }],
      dependents: [],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should patch a single pinned dependent', async () => {
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'pinned-caret-tilde-dependents',
    );
    mockUserResponses({ releases: { 'depended-upon': 'patch' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'depended-upon', type: 'patch' }],
      dependents: [
        { name: 'pinned-dep', type: 'patch', dependencies: ['depended-upon'] },
      ],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should patch a pinned and a tilde dependent', async () => {
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'pinned-caret-tilde-dependents',
    );
    mockUserResponses({ releases: { 'depended-upon': 'minor' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'depended-upon', type: 'minor' }],
      dependents: [
        { name: 'pinned-dep', type: 'patch', dependencies: ['depended-upon'] },
        { name: 'tilde-dep', type: 'patch', dependencies: ['depended-upon'] },
      ],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should patch a pinned and a tilde dependent', async () => {
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'pinned-caret-tilde-dependents',
    );
    mockUserResponses({ releases: { 'depended-upon': 'major' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'depended-upon', type: 'major' }],
      dependents: [
        { name: 'caret-dep', type: 'patch', dependencies: ['depended-upon'] },
        { name: 'pinned-dep', type: 'patch', dependencies: ['depended-upon'] },
        { name: 'tilde-dep', type: 'patch', dependencies: ['depended-upon'] },
      ],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should patch a transitively bumped dependent', async () => {
    // Here we have a project where b -> a and c -> b, all pinned, so bumping a should bump b and c
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'simplest-transitive-dependents',
    );
    mockUserResponses({ releases: { 'pkg-a': 'patch' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'pkg-a', type: 'patch' }],
      dependents: [
        { name: 'pkg-b', type: 'patch', dependencies: ['pkg-a'] },
        { name: 'pkg-c', type: 'patch', dependencies: ['pkg-b'] },
      ],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should patch a previously checked transitive dependent', async () => {
    // Here we use project where b->a (caret) and c->a (pinned) and b -> c (pinned)
    // Therefore bumping a will bump c (but not b), but bumping c will bump b anyway
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'previously-checked-transitive-dependent',
    );
    mockUserResponses({ releases: { 'pkg-a': 'patch' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'pkg-a', type: 'patch' }],
      dependents: [
        { name: 'pkg-c', type: 'patch', dependencies: ['pkg-a'] },
        { name: 'pkg-b', type: 'patch', dependencies: ['pkg-c', 'pkg-a'] },
      ],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should patch a pinned peerDep', async () => {
    // Bumping a pinned peer dep should patch the dependent
    // We are being very cautious with the tests here, since there is so much complexity around
    // peerDep bumping
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'simple-pinned-peer-dep',
    );
    mockUserResponses({ releases: { 'depended-upon': 'patch' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'depended-upon', type: 'patch' }],
      dependents: [
        {
          name: 'has-peer-dep',
          type: 'patch',
          dependencies: ['depended-upon'],
        },
      ],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should not bump the dependent when bumping a tilde peerDep by patch', async () => {
    // example: has-peer-dep has a tilde peerDep on dependend-upon. If depended-upon is patched
    // we wont leave semver range, therefore, should not bump. This behviour should also happen
    // for a caret dep.
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'simple-tilde-peer-dep',
    );
    mockUserResponses({ releases: { 'depended-upon': 'patch' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'depended-upon', type: 'patch' }],
      dependents: [],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should major bump dependent when bumping a tilde peerDep by minor', async () => {
    // example: has-peer-dep has a tilde peerDep on dependend-upon. If depended-upon is minor bumped
    // we will leave semver range, therefore, should bump, but it's a peerDep, so we major bump
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'simple-tilde-peer-dep',
    );
    mockUserResponses({ releases: { 'depended-upon': 'minor' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'depended-upon', type: 'minor' }],
      dependents: [
        {
          name: 'has-peer-dep',
          type: 'major',
          dependencies: ['depended-upon'],
        },
      ],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should major bump dependent when bumping a tilde peerDep by major', async () => {
    // example: same example as above, should major bump the dependent
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'simple-tilde-peer-dep',
    );
    mockUserResponses({ releases: { 'depended-upon': 'major' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'depended-upon', type: 'major' }],
      dependents: [
        {
          name: 'has-peer-dep',
          type: 'major',
          dependencies: ['depended-upon'],
        },
      ],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should not bump dependent when bumping caret peerDep by patch', async () => {
    // example: We are not leaving the semver range, so we should not be bumping
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'simple-caret-peer-dep',
    );
    mockUserResponses({ releases: { 'depended-upon': 'patch' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'depended-upon', type: 'patch' }],
      dependents: [],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should major bump dependent when bumping caret peerDep by minor', async () => {
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'simple-caret-peer-dep',
    );
    mockUserResponses({ releases: { 'depended-upon': 'minor' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'depended-upon', type: 'minor' }],
      dependents: [
        {
          name: 'has-peer-dep',
          type: 'major',
          dependencies: ['depended-upon'],
        },
      ],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });

  it('should major bump dependent when bumping caret peerDep by major', async () => {
    const cwd = await copyFixtureIntoTempDir(
      __dirname,
      'simple-caret-peer-dep',
    );
    mockUserResponses({ releases: { 'depended-upon': 'major' } });
    const cs = await changesetCommand({ cwd });

    const expectedChangeset = {
      summary: 'summary message mock',
      releases: [{ name: 'depended-upon', type: 'major' }],
      dependents: [
        {
          name: 'has-peer-dep',
          type: 'major',
          dependencies: ['depended-upon'],
        },
      ],
    };
    const call = createChangesetCommit.mock.calls[0][0];
    expect(call).toEqual(expectedChangeset);
  });
});
