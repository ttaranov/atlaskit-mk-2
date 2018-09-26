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

export default () => (
  <IntlProvider>
    <Wrapper>
      <section>
        <h6>CommitList: Example w/o builds</h6>
        <CommitsWrapper>
          <CommitList commits={mockCommitsArray} linkTarget="_blank" />
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
];
