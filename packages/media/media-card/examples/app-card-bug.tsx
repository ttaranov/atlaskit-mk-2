/* tslint:disable:no-console */
import * as React from 'react';
import {
  AppCardView,
  AppCardModel,
  AppCardAction,
} from '../src/app_2/AppCardViewV2';

const actions: AppCardAction[] = [
  // primaryAction,
  {
    title: 'Open',
    target: {
      // receiver: 'some.receiver1',
      key: 'test.target.open',
    },
    // parameters: {
    //   expenseId: 'some-id1',
    // },
  },
  {
    title: 'Join',
    target: {
      // receiver: 'some.receiver2',
      key: 'test.target.join',
    },
    parameters: {
      'custom-param-from-card': 'some value',
    },
  },
  {
    title: 'Reply',
    target: {
      // receiver: 'some.receiver3',
      key: 'test.target.reply',
    },
    parameters: {
      then: 'some-id3',
    },
  },
];
const model = {
  link: {
    url:
      'https://bitbucket.org/hipchat/banana-addon-bitbucket/pull-requests/133',
  },
  title: {
    text: '#133: added refresh button',
    user: {
      icon: {
        url: 'https://bitbucket.org/account/icheremskyi/avatar/32/',
        label: 'Ihor Cheremskyi',
      },
    },
  },
  details: [
    {
      icon: {
        url:
          'https://banana-addon-bitbucket.us-west-2.prod.public.atl-paas.net/icons/bitbucket/branches.png',
        label: 'Branch',
      },
      text: 'refrsh-buton',
    },
    {
      icon: {
        url:
          'https://banana-addon-bitbucket.us-west-2.prod.public.atl-paas.net/icons/bitbucket/target.png',
        label: 'Target',
      },
      text: 'master',
    },
    {
      title: 'Reviewers',
      users: [
        {
          icon: {
            url: 'https://bitbucket.org/account/drudzik/avatar/32/',
            label: 'Dmytro Rudzik',
          },
        },
        {
          icon: {
            url: 'https://bitbucket.org/account/OleksiiChuian/avatar/32/',
            label: 'Oleksii Chuian',
          },
        },
      ],
    },
  ],
  context: {
    text: 'Bitbucket / banana-addon-bitbucket',
    icon: {
      url:
        'https://banana-addon-bitbucket.us-west-2.prod.public.atl-paas.net/icons/bitbucket-logo.png',
      label: 'hipchat/banana-addon-bitbucket',
    },
  },
  text: '',
  actions,
};

export default () => <AppCardView newDesign={true} model={model} />;
