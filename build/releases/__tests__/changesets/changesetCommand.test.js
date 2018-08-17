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

describe('Changesets', () => {
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

  it('should patch pinned and tilde dependents when minor bumping', async () => {
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

  it('should patch pinned, tilde and caret deps when major bumping', async () => {
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

  it('should patch a transitively bumped dependent that leaves range', async () => {
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
});
