import { gridSize } from '@atlaskit/theme';
import React from 'react';
import styled from 'styled-components';

import { CommitList } from '../src/';

import { IntlProvider } from 'react-intl';

const Wrapper = styled.div`
  margin: ${3 * gridSize()}px;
`;

const CommitsWrapper = styled.div`
  margin: ${2 * gridSize()}px ${gridSize()}px;
`;

function decorateBuilds(commits) {
  // Get a different chunk offset of mockBuildsArray for each commit
  const buildsChunk = Math.floor(mockBuildsArray.length / commits.length);

  return commits.map((commit, i) => ({
    ...commit,
    extra: {
      builds: mockBuildsArray.slice(
        buildsChunk * i,
        buildsChunk * i + buildsChunk,
      ),
    },
  }));
}

export default () => (
  <IntlProvider>
    <Wrapper>
      <section>
        <h6>CommitList: Example with table headers</h6>
        <CommitsWrapper>
          <CommitList commits={decorateBuilds(mockCommitsArray)} showHeaders />
        </CommitsWrapper>
      </section>
    </Wrapper>
  </IntlProvider>
);

// mock data
const mockCommitsArray = [
  {
    hash: 'cf53ce01402dd301185909d7949ebcef86ba2068',
    repository: {
      links: {
        self: {
          href: 'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit',
        },
        html: {
          href: 'https://bitbucket.org/bitbucket/bitkit',
        },
        avatar: {
          href: 'https://bitbucket.org/bitbucket/bitkit/avatar/32/',
        },
      },
      type: 'repository',
      name: 'bitkit',
      full_name: 'bitbucket/bitkit',
      uuid: '{bc1ccbf0-5842-4e63-ad72-152606253d8a}',
    },
    links: {
      self: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/cf53ce01402dd301185909d7949ebcef86ba2068',
      },
      comments: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/cf53ce01402dd301185909d7949ebcef86ba2068/comments',
      },
      patch: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/patch/cf53ce01402dd301185909d7949ebcef86ba2068',
      },
      html: {
        href:
          'https://bitbucket.org/bitbucket/bitkit/commits/cf53ce01402dd301185909d7949ebcef86ba2068',
      },
      diff: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/diff/cf53ce01402dd301185909d7949ebcef86ba2068',
      },
      approve: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/cf53ce01402dd301185909d7949ebcef86ba2068/approve',
      },
      statuses: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/cf53ce01402dd301185909d7949ebcef86ba2068/statuses',
      },
    },
    author: {
      raw: 'bitbucket <bitbucket@pipelines>',
      type: 'author',
    },
    parents: [
      {
        hash: 'f22f269df5c111d79b13e8d9a7606ecd262240e0',
        type: 'commit',
        links: {
          self: {
            href:
              'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/f22f269df5c111d79b13e8d9a7606ecd262240e0',
          },
          html: {
            href:
              'https://bitbucket.org/bitbucket/bitkit/commits/f22f269df5c111d79b13e8d9a7606ecd262240e0',
          },
        },
      },
    ],
    date: '2017-08-22T19:04:08+00:00',
    message: '0.35.58 [skip ci]\n',
    type: 'commit',
  },
  {
    hash: 'f22f269df5c111d79b13e8d9a7606ecd262240e0',
    repository: {
      links: {
        self: {
          href: 'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit',
        },
        html: {
          href: 'https://bitbucket.org/bitbucket/bitkit',
        },
        avatar: {
          href: 'https://bitbucket.org/bitbucket/bitkit/avatar/32/',
        },
      },
      type: 'repository',
      name: 'bitkit',
      full_name: 'bitbucket/bitkit',
      uuid: '{bc1ccbf0-5842-4e63-ad72-152606253d8a}',
    },
    links: {
      self: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/f22f269df5c111d79b13e8d9a7606ecd262240e0',
      },
      comments: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/f22f269df5c111d79b13e8d9a7606ecd262240e0/comments',
      },
      html: {
        href:
          'https://bitbucket.org/bitbucket/bitkit/commits/f22f269df5c111d79b13e8d9a7606ecd262240e0',
      },
      diff: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/diff/f22f269df5c111d79b13e8d9a7606ecd262240e0',
      },
      approve: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/f22f269df5c111d79b13e8d9a7606ecd262240e0/approve',
      },
      statuses: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/f22f269df5c111d79b13e8d9a7606ecd262240e0/statuses',
      },
    },
    author: {
      raw: 'Michael Frauenholtz <mfrauenholtz@atlassian.com>',
      type: 'author',
      user: {
        username: 'mafrauen',
        display_name: 'Michael Frauenholtz',
        type: 'user',
        uuid: '{d584d292-d032-4483-bc78-e78423d633ad}',
        links: {
          self: {
            href: 'https://bitbucket.org/!api/2.0/users/mafrauen',
          },
          html: {
            href: 'https://bitbucket.org/mafrauen/',
          },
          avatar: {
            href: 'https://bitbucket.org/account/mafrauen/avatar/32/',
          },
        },
      },
    },
    parents: [
      {
        hash: '81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
        type: 'commit',
        links: {
          self: {
            href:
              'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
          },
          html: {
            href:
              'https://bitbucket.org/bitbucket/bitkit/commits/81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
          },
        },
      },
      {
        hash: 'ded62bdd890f128cd74bad874df9ddf411c8a1d2',
        type: 'commit',
        links: {
          self: {
            href:
              'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/ded62bdd890f128cd74bad874df9ddf411c8a1d2',
          },
          html: {
            href:
              'https://bitbucket.org/bitbucket/bitkit/commits/ded62bdd890f128cd74bad874df9ddf411c8a1d2',
          },
        },
      },
    ],
    date: '2017-08-22T18:58:39+00:00',
    message:
      'Merged in fix-build (pull request #102)\n\nFix lint errors\n\nApproved-by: Peter Williams <pwilliams@atlassian.com>\nApproved-by: Stacy London <slondon@atlassian.com>\n',
    type: 'commit',
  },
  {
    hash: 'ab046077ca1cca96b0d5ea629340855119051ed0',
    repository: {
      links: {
        self: {
          href: 'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit',
        },
        html: {
          href: 'https://bitbucket.org/bitbucket/bitkit',
        },
        avatar: {
          href: 'https://bitbucket.org/bitbucket/bitkit/avatar/32/',
        },
      },
      type: 'repository',
      name: 'bitkit',
      full_name: 'bitbucket/bitkit',
      uuid: '{bc1ccbf0-5842-4e63-ad72-152606253d8a}',
    },
    links: {
      self: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/ab046077ca1cca96b0d5ea629340855119051ed0',
      },
      comments: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/ab046077ca1cca96b0d5ea629340855119051ed0/comments',
      },
      patch: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/patch/ab046077ca1cca96b0d5ea629340855119051ed0',
      },
      html: {
        href:
          'https://bitbucket.org/bitbucket/bitkit/commits/ab046077ca1cca96b0d5ea629340855119051ed0',
      },
      diff: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/diff/ab046077ca1cca96b0d5ea629340855119051ed0',
      },
      approve: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/ab046077ca1cca96b0d5ea629340855119051ed0/approve',
      },
      statuses: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/ab046077ca1cca96b0d5ea629340855119051ed0/statuses',
      },
    },
    author: {
      raw: 'Christian Doan <cdoan@atlassian.com>',
      type: 'author',
      user: {
        username: 'cdoan-atlassian',
        display_name: 'Christian Doan',
        type: 'user',
        uuid: '{d8c373f7-523e-466c-9370-a0decc611775}',
        links: {
          self: {
            href: 'https://bitbucket.org/!api/2.0/users/cdoan-atlassian',
          },
          html: {
            href: 'https://bitbucket.org/cdoan-atlassian/',
          },
          avatar: {
            href: 'https://bitbucket.org/account/cdoan-atlassian/avatar/32/',
          },
        },
      },
    },
    parents: [
      {
        hash: '81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
        type: 'commit',
        links: {
          self: {
            href:
              'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
          },
          html: {
            href:
              'https://bitbucket.org/bitbucket/bitkit/commits/81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
          },
        },
      },
    ],
    date: '2017-08-22T18:51:06+00:00',
    message:
      'Revert "Moved feedback nav item to profile menu (pull request #59)"\n\nThis reverts pull request #59.\n\n> Preparing in advance of ADG3 GA, and removal of opt-out:\r\n> \r\n> * Moved feedback nav item from the container nav to the profile menu.\r\n> * Removed opt-out item',
    type: 'commit',
  },
  {
    hash: '1f2ca0011acb638b119bea6308ae0ff3745b2782',
    repository: {
      links: {
        self: {
          href: 'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit',
        },
        html: {
          href: 'https://bitbucket.org/bitbucket/bitkit',
        },
        avatar: {
          href: 'https://bitbucket.org/bitbucket/bitkit/avatar/32/',
        },
      },
      type: 'repository',
      name: 'bitkit',
      full_name: 'bitbucket/bitkit',
      uuid: '{bc1ccbf0-5842-4e63-ad72-152606253d8a}',
    },
    links: {
      self: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/1f2ca0011acb638b119bea6308ae0ff3745b2782',
      },
      comments: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/1f2ca0011acb638b119bea6308ae0ff3745b2782/comments',
      },
      patch: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/patch/1f2ca0011acb638b119bea6308ae0ff3745b2782',
      },
      html: {
        href:
          'https://bitbucket.org/bitbucket/bitkit/commits/1f2ca0011acb638b119bea6308ae0ff3745b2782',
      },
      diff: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/diff/1f2ca0011acb638b119bea6308ae0ff3745b2782',
      },
      approve: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/1f2ca0011acb638b119bea6308ae0ff3745b2782/approve',
      },
      statuses: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/1f2ca0011acb638b119bea6308ae0ff3745b2782/statuses',
      },
    },
    author: {
      raw: 'Michael Frauenholtz <mfrauenholtz@atlassian.com>',
      type: 'author',
      user: {
        username: 'mafrauen',
        display_name: 'Michael Frauenholtz',
        type: 'user',
        uuid: '{d584d292-d032-4483-bc78-e78423d633ad}',
        links: {
          self: {
            href: 'https://bitbucket.org/!api/2.0/users/mafrauen',
          },
          html: {
            href: 'https://bitbucket.org/mafrauen/',
          },
          avatar: {
            href: 'https://bitbucket.org/account/mafrauen/avatar/32/',
          },
        },
      },
    },
    parents: [
      {
        hash: '81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
        type: 'commit',
        links: {
          self: {
            href:
              'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
          },
          html: {
            href:
              'https://bitbucket.org/bitbucket/bitkit/commits/81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
          },
        },
      },
    ],
    date: '2017-08-22T18:28:44+00:00',
    message: 'Fix lint errors\n',
    type: 'commit',
  },
  {
    hash: '81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
    repository: {
      links: {
        self: {
          href: 'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit',
        },
        html: {
          href: 'https://bitbucket.org/bitbucket/bitkit',
        },
        avatar: {
          href: 'https://bitbucket.org/bitbucket/bitkit/avatar/32/',
        },
      },
      type: 'repository',
      name: 'bitkit',
      full_name: 'bitbucket/bitkit',
      uuid: '{bc1ccbf0-5842-4e63-ad72-152606253d8a}',
    },
    links: {
      self: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
      },
      comments: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/81681122f6c8a22d1aa713b4f92c5a02022ca3e2/comments',
      },
      html: {
        href:
          'https://bitbucket.org/bitbucket/bitkit/commits/81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
      },
      diff: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/diff/81681122f6c8a22d1aa713b4f92c5a02022ca3e2',
      },
      approve: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/81681122f6c8a22d1aa713b4f92c5a02022ca3e2/approve',
      },
      statuses: {
        href:
          'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/81681122f6c8a22d1aa713b4f92c5a02022ca3e2/statuses',
      },
    },
    author: {
      raw: 'Michael Frauenholtz <mfrauenholtz@atlassian.com>',
      type: 'author',
      user: {
        username: 'mafrauen',
        display_name: 'Michael Frauenholtz',
        type: 'user',
        uuid: '{d584d292-d032-4483-bc78-e78423d633ad}',
        links: {
          self: {
            href: 'https://bitbucket.org/!api/2.0/users/mafrauen',
          },
          html: {
            href: 'https://bitbucket.org/mafrauen/',
          },
          avatar: {
            href: 'https://bitbucket.org/account/mafrauen/avatar/32/',
          },
        },
      },
    },
    parents: [
      {
        hash: '321a87f1340bf0cb0a5234c737b65bcbd256a368',
        type: 'commit',
        links: {
          self: {
            href:
              'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/321a87f1340bf0cb0a5234c737b65bcbd256a368',
          },
          html: {
            href:
              'https://bitbucket.org/bitbucket/bitkit/commits/321a87f1340bf0cb0a5234c737b65bcbd256a368',
          },
        },
      },
      {
        hash: 'f839dc3d77d6df94a19adb9cee35f7440247d1ba',
        type: 'commit',
        links: {
          self: {
            href:
              'https://bitbucket.org/!api/2.0/repositories/bitbucket/bitkit/commit/f839dc3d77d6df94a19adb9cee35f7440247d1ba',
          },
          html: {
            href:
              'https://bitbucket.org/bitbucket/bitkit/commits/f839dc3d77d6df94a19adb9cee35f7440247d1ba',
          },
        },
      },
    ],
    date: '2017-08-22T17:20:32+00:00',
    message:
      'Merged in mfrauenholtz/list-updated-packages (pull request #94)\n\nInitial work for having CI publish our component packages\n\nApproved-by: Peter Williams <pwilliams@atlassian.com>\nApproved-by: Stacy London <slondon@atlassian.com>\n',
    type: 'commit',
  },
];

export const mockBuildsArray = [
  {
    key: '1',
    name:
      'unit Tests (Python) - P5 unit Tests (Python) - P5 unit Tests (Python) - P5 unit Tests (Python) - P5',
    description: '497 tests passed',
    updated_on: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    url: 'https://www.some-url.com',
    state: 'SUCCESSFUL',
  },
  {
    key: '2',
    name: 'Linting (eslint)',
    description: '1 test passed',
    updated_on: '2017-07-05T14:48:00.000Z',
    url: 'https://www.some-url.com',
    state: 'SUCCESSFUL',
  },
  {
    key: '3',
    name: 'unit Tests (Python) - P5',
    description: '497 tests passed',
    updated_on: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    url: 'https://www.some-url.com',
    state: 'SUCCESSFUL',
  },
  {
    key: '4',
    name: 'Linting (pyflakes)',
    description: '0 tests passed',
    updated_on: '2017-07-05T14:48:00.000Z',
    url: 'https://www.some-url.com',
    state: 'SUCCESSFUL',
  },
  {
    key: '5',
    name: 'unit Tests (Python) - P5',
    description: '497 tests passed',
    updated_on: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    url: 'https://www.some-url.com',
    state: 'SUCCESSFUL',
  },
  {
    key: '6',
    name: 'Linting (eslint)',
    description: '1 test passed',
    updated_on: '2017-07-05T14:48:00.000Z',
    url: 'https://www.some-url.com',
    state: 'SUCCESSFUL',
  },
  {
    key: '7',
    name: 'unit Tests (Python) - P5',
    description: '497 tests passed',
    updated_on: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    url: 'https://www.some-url.com',
    state: 'SUCCESSFUL',
  },
  {
    key: '8',
    name: 'unit Tests (Python) - P5',
    description: '497 tests passed',
    updated_on: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    url: 'https://www.some-url.com',
    state: 'INPROGRESS',
  },
  {
    key: '9',
    name: 'unit Tests (Python) - P5',
    description: '497 tests passed',
    updated_on: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    url: 'https://www.some-url.com',
    state: 'STOPPED',
  },
  {
    key: '10',
    name: 'unit Tests (Python) - P5',
    description: '497 tests passed',
    updated_on: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    url: 'https://www.some-url.com',
    state: 'FAILED',
  },
];
