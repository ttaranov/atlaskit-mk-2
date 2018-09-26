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

class DynamicCommitList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commits: props.commits.slice(0, 2),
      hasMore: props.commits.length > 2,
      isLoading: false,
    };
  }

  onShowMoreClick = () => {
    this.setState({ isLoading: true });
    setTimeout(() => {
      const { commits } = this.props;

      this.setState({
        commits,
        hasMore: false,
        isLoading: false,
      });
    }, 2500);
  };

  render() {
    const { commits, hasMore, ...props } = this.props;
    return (
      <CommitList
        commits={this.state.commits}
        hasMore={this.state.hasMore}
        isLoading={this.state.isLoading}
        onShowMoreClick={this.onShowMoreClick}
        {...props}
      />
    );
  }
}

export default () => (
  <IntlProvider>
    <Wrapper>
      <section>
        <h6>CommitList: Example with dynamic loading</h6>
        <CommitsWrapper>
          <DynamicCommitList commits={mockCommitsArrayLong} />
        </CommitsWrapper>
      </section>
    </Wrapper>
  </IntlProvider>
);

// mock data
const mockCommitsArrayLong = [
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
];
