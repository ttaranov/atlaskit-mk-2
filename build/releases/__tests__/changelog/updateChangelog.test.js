import { copyFixtureIntoTempDir } from 'jest-fixtures';
import { updateChangelog } from '../../changelog';
import path from 'path';
import fs from 'fs';

jest.mock('@atlaskit/build-utils/logger');

const emptyFileChangeset = {
  releases: [
    { name: 'has-empty-changelog', commits: ['b8bb699'], version: '1.1.0' },
  ],
  changesets: [
    {
      summary: 'This is a summary',
      releases: [{ name: 'has-empty-changelog', type: 'minor' }],
      dependents: [],
      commit: 'b8bb699',
    },
  ],
};

const noChangelogFileChangeset = {
  releases: [
    { name: 'has-no-changelog', commits: ['b8bb699'], version: '1.1.0' },
  ],
  changesets: [
    {
      summary: 'This is a summary',
      releases: [{ name: 'has-no-changelog', type: 'minor' }],
      dependents: [],
      commit: 'b8bb699',
    },
  ],
};
const filledChangelogContent = `# Has Empty Changelog

## 1.0.0
- [patch] This existed before [b8bb699](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8bb699)
- [minor] This also existed before [abcdefg](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abcdefg)
`;

const hasFilledChangelogChangeset = {
  releases: [
    { name: 'has-filled-changelog', commits: ['b8bb699'], version: '1.1.0' },
  ],
  changesets: [
    {
      summary: 'This is a summary',
      releases: [{ name: 'has-filled-changelog', type: 'minor' }],
      dependents: [],
      commit: 'b8bb699',
    },
  ],
};

const multipleChangesets = {
  releases: [
    {
      name: 'has-empty-changelog',
      commits: ['b8bb699', 'abcdefg'],
      version: '1.1.0',
    },
  ],
  changesets: [
    {
      summary: 'This is a summary',
      releases: [{ name: 'has-empty-changelog', type: 'patch' }],
      dependents: [],
      commit: 'b8bb699',
    },
    {
      summary: 'This is a second summary',
      releases: [{ name: 'has-empty-changelog', type: 'minor' }],
      dependents: [],
      commit: 'abcdefg',
    },
  ],
};

const multipleReleaseObj = {
  releases: [
    { name: 'has-empty-changelog', commits: ['b8bb699'], version: '1.1.0' },
    { name: 'has-filled-changelog', commits: ['b8bb699'], version: '1.0.1' },
  ],
  changesets: [
    {
      summary: 'This is a summary',
      releases: [
        { name: 'has-empty-changelog', type: 'minor' },
        { name: 'has-filled-changelog', type: 'patch' },
      ],
      dependents: [],
      commit: 'b8bb699',
    },
  ],
};

describe('updateChangelog', async () => {
  let cwd, emptyChangelogPath, existingChangelogPath, noChangelogPath;
  const repoUrl = 'https://bitbucket.org/atlassian/atlaskit-mk-2/commits';
  beforeEach(async () => {
    cwd = await copyFixtureIntoTempDir(
      __dirname,
      'simple-project-with-changelogs',
    );
    emptyChangelogPath = path.join(
      cwd,
      'packages',
      'has-empty-changelog',
      'CHANGELOG.md',
    );
    existingChangelogPath = path.join(
      cwd,
      'packages',
      'has-filled-changelog',
      'CHANGELOG.md',
    );
    noChangelogPath = path.join(
      cwd,
      'packages',
      'has-no-changelog',
      'CHANGELOG.md',
    );
  });

  it('should work with empty changelog', async () => {
    const initalChangelog = fs.readFileSync(emptyChangelogPath).toString();
    expect(initalChangelog).toEqual('');
    await updateChangelog(emptyFileChangeset, { cwd });

    const updatedChangelog = fs.readFileSync(emptyChangelogPath).toString();
    expect(updatedChangelog).toEqual(`# has-empty-changelog

## 1.1.0
- [minor] This is a summary [b8bb699](https://somewhere-fake-to-visit.com/b8bb699)
`);
  });
  it('should work with multiple changesets', async () => {
    const initalChangelog = fs.readFileSync(emptyChangelogPath).toString();
    expect(initalChangelog).toEqual('');
    await updateChangelog(multipleChangesets, { cwd });

    const updatedChangelog = fs.readFileSync(emptyChangelogPath).toString();
    expect(updatedChangelog).toEqual(`# has-empty-changelog

## 1.1.0
- [patch] This is a summary [b8bb699](https://somewhere-fake-to-visit.com/b8bb699)
- [minor] This is a second summary [abcdefg](https://somewhere-fake-to-visit.com/abcdefg)
`);
  });
  it('should work for multiple packages', async () => {
    const initalChangelog = fs.readFileSync(emptyChangelogPath).toString();
    const existingInitial = fs.readFileSync(existingChangelogPath).toString();
    expect(initalChangelog).toEqual('');
    expect(existingInitial).toEqual(filledChangelogContent);
    await updateChangelog(multipleReleaseObj, { cwd });

    const updatedChangelog = fs.readFileSync(emptyChangelogPath).toString();
    const updatedExistingChangelog = fs
      .readFileSync(existingChangelogPath)
      .toString();
    expect(updatedChangelog).toEqual(`# has-empty-changelog

## 1.1.0
- [minor] This is a summary [b8bb699](https://somewhere-fake-to-visit.com/b8bb699)
`);
    expect(updatedExistingChangelog).toEqual(`# Has Empty Changelog

## 1.0.1
- [patch] This is a summary [b8bb699](https://somewhere-fake-to-visit.com/b8bb699)

## 1.0.0
- [patch] This existed before [b8bb699](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8bb699)
- [minor] This also existed before [abcdefg](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abcdefg)
`);
  });
  it('should return the updated file paths', async () => {
    const updatedPackages = await updateChangelog(multipleReleaseObj, { cwd });
    expect(updatedPackages).toEqual([
      emptyChangelogPath,
      existingChangelogPath,
    ]);
  });
  it('has no changelog file', async () => {
    const changelogExists = fs.existsSync(noChangelogPath);
    expect(changelogExists).toEqual(false);
    await updateChangelog(noChangelogFileChangeset, { cwd });

    const updatedChangelog = fs.readFileSync(noChangelogPath).toString();
    expect(updatedChangelog).toEqual(`# has-no-changelog

## 1.1.0
- [minor] This is a summary [b8bb699](https://somewhere-fake-to-visit.com/b8bb699)
`);
  });
  it('should work with an existing changelog', async () => {
    const initalChangelog = fs.readFileSync(existingChangelogPath).toString();

    expect(initalChangelog).toEqual(filledChangelogContent);
    await updateChangelog(hasFilledChangelogChangeset, { cwd });

    const updatedChangelog = fs.readFileSync(existingChangelogPath).toString();
    expect(updatedChangelog).toEqual(`# Has Empty Changelog

## 1.1.0
- [minor] This is a summary [b8bb699](https://somewhere-fake-to-visit.com/b8bb699)

## 1.0.0
- [patch] This existed before [b8bb699](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8bb699)
- [minor] This also existed before [abcdefg](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/abcdefg)
`);
  });
});
