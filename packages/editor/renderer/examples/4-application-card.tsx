/* tslint:disable: no-console */

import * as React from 'react';
import { AppCardViewProps, ApplicationCard } from '../src/react/nodes';

const eventHandlers: any = {
  applicationCard: {
    onClick: url =>
      console.log('ApplicationCard click', '[react.MouseEvent]', url),
    onActionClick: (applicationCardAction, handlers) => {
      console.log(
        'ApplicationCard action click',
        '[react.MouseEvent]',
        applicationCardAction,
      );
      handlers.progress();
      switch (applicationCardAction.target.key) {
        case 'success':
          setTimeout(() => {
            handlers.success('Yey. It works.');
          }, 2000);
          break;
        case 'failure':
          setTimeout(() => {
            handlers.failure('There is a glitch.');
          }, 2000);
          break;
        case 'loading':
          setTimeout(() => {
            handlers.success();
          }, 2000);
          break;
        case 'failure-with-retry':
          setTimeout(() => {
            handlers.failure('Some error', true, 'Try again btn text');
          }, 2000);
          break;
      }
    },
  },
};

const actions = [
  {
    key: 'test-unique-key1',
    title: 'Success',
    target: {
      receiver: 'test-reciever',
      key: 'success',
    },
    parameters: {
      test: 20,
    },
  },
  {
    key: 'test-unique-key2',
    title: 'Failure',
    target: {
      receiver: 'test-reciever',
      key: 'failure',
    },
    parameters: {
      test: 30,
    },
  },
  {
    title: 'Loading',
    target: {
      receiver: 'test-reciever',
      key: 'loading',
    },
    parameters: {
      test: 20,
    },
  },
  {
    title: 'Failure with retry',
    target: {
      receiver: 'test-reciever',
      key: 'failure-with-retry',
    },
    parameters: {
      test: 20,
    },
  },
];

const attrs = {
  text: 'applicationCard',
  background: {
    url: 'http://atlassian.com',
  },
  link: {
    url: 'http://atlassian.com',
  },
  title: {
    text: 'Sascha Reuter commented on a file: Desktop sidebar states.png',
  },
  user: {
    icon: {
      url:
        'https://extranet.atlassian.com/download/attachments/2246873520/sreuter-57703-pp-1530510_4271148635152_5186589029777108540_n.jpg',
      label: 'Sascha Reuter',
    },
  },
  preview: {
    url:
      'https://image.ibb.co/ghKzoF/1a99566b0c8e0589ca327bb1efe0be5ca1419aa8.png',
  },
  description: {
    title: 'Can haz description',
    text:
      '\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius mattis massa, quis ornare orci. Integer congue\nrutrum velit, quis euismod eros condimentum quis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris\nlobortis nibh id odio egestas luctus. Nunc nulla lacus, congue eu nibh non, imperdiet varius lacus. Nulla sagittis\nmagna et tincidunt volutpat. Nunc augue lorem, eleifend et tempor ut, malesuada ac lorem. Praesent quis feugiat eros,\net vehicula nibh. Maecenas vehicula commodo nisi, at rutrum ipsum posuere sit amet. Integer sit amet nisl sed ligula\nconsectetur feugiat non at ligula. Cras dignissim suscipit magna at mattis. Maecenas ante leo, feugiat vestibulum velit\na, commodo finibus velit. Maecenas interdum ullamcorper velit non suscipit. Proin tempor, magna vitae dapibus laoreet,\nquam dui convallis lectus, in vestibulum arcu eros eu velit. Quisque vel dolor enim.\n',
  },
  details: [
    {
      icon: {
        url:
          'http://www.fellowshipgw.com/wp-content/themes/lenexabaptist/images/icon-story-gray.png',
        label: 'Issue type',
      },
      text: 'Story',
    },
    {
      badge: {
        value: 101,
        max: 99,
        appearance: 'important',
      },
    },
    {
      lozenge: {
        text: 'In Progress',
        appearance: 'inprogress',
      },
    },
    {
      title: 'Watchers',
      users: [
        {
          icon: {
            url:
              'https://extranet.atlassian.com/download/attachments/3189817539/user-avatar',
            label: 'James Newell',
          },
        },
        {
          icon: {
            url:
              'https://extranet.atlassian.com/download/attachments/2928873907/user-avatar',
            label: 'Jon Blower',
          },
        },
        {
          icon: {
            url:
              'https://extranet.atlassian.com/download/attachments/2491694727/user-avatar',
            label: 'Scott Simpson',
          },
        },
      ],
    },
    {
      icon: {
        url:
          'http://www.fellowshipgw.com/wp-content/themes/lenexabaptist/images/icon-story-gray.png',
        label: 'Issue type',
      },
      text: 'Story',
    },
    {
      badge: {
        value: 101,
        max: 99,
        appearance: 'important',
      },
    },
    {
      lozenge: {
        text: 'In Progress',
        appearance: 'inprogress',
      },
    },
    {
      title: 'Watchers',
      users: [
        {
          icon: {
            url:
              'https://extranet.atlassian.com/download/attachments/3189817539/user-avatar',
            label: 'James Newell',
          },
        },
        {
          icon: {
            url:
              'https://extranet.atlassian.com/download/attachments/2928873907/user-avatar',
            label: 'Jon Blower',
          },
        },
        {
          icon: {
            url:
              'https://extranet.atlassian.com/download/attachments/2491694727/user-avatar',
            label: 'Scott Simpson',
          },
        },
      ],
    },
    {
      icon: {
        url:
          'http://www.fellowshipgw.com/wp-content/themes/lenexabaptist/images/icon-story-gray.png',
        label: 'Issue type',
      },
      text: 'Story',
    },
    {
      badge: {
        value: 101,
        max: 99,
        appearance: 'important',
      },
    },
    {
      lozenge: {
        text: 'In Progress',
        appearance: 'inprogress',
      },
    },
    {
      title: 'Watchers',
      users: [
        {
          icon: {
            url:
              'https://extranet.atlassian.com/download/attachments/3189817539/user-avatar',
            label: 'James Newell',
          },
        },
        {
          icon: {
            url:
              'https://extranet.atlassian.com/download/attachments/2928873907/user-avatar',
            label: 'Jon Blower',
          },
        },
        {
          icon: {
            url:
              'https://extranet.atlassian.com/download/attachments/2491694727/user-avatar',
            label: 'Scott Simpson',
          },
        },
      ],
    },
  ],
  context: {
    text: 'Design Home / ... / Media Cards Design',
    icon: {
      url:
        'https://image.ibb.co/jSrC8F/f4b5e33d6b1d36556114a18b594768f41f32673e.png',
      label: 'foobar',
    },
    link: {
      url: 'https://confluence.atlassian.com/',
    },
  },
  actions,
  eventHandlers,
};

const attrsCardWithoutIcon = {
  text: 'google',
  title: { text: 'Google' },
  collapsible: false,
  textUrl: 'https://google.com',
  link: { url: 'https://google.com' },
  description: { text: 'This is a test' },
  context: { text: 'google.com' },
};

export default function Example() {
  return (
    <div>
      <div>
        <ApplicationCard
          title={{ text: 'applicationCard' }}
          {...attrs as AppCardViewProps}
          actions={actions.slice(0, 1)}
        />
        <ApplicationCard
          title={{ text: 'applicationCard' }}
          {...attrs as AppCardViewProps}
          actions={actions.slice(0, 2)}
        />
        <ApplicationCard
          title={{ text: 'applicationCard' }}
          {...attrs as AppCardViewProps}
          actions={actions}
        />
      </div>
      <div>
        <ApplicationCard
          title={{ text: 'applicationCard' }}
          {...attrs as AppCardViewProps}
          actions={actions.slice(0, 1)}
          background={undefined}
        />
        <ApplicationCard
          title={{ text: 'applicationCard' }}
          {...attrs as AppCardViewProps}
          actions={actions.slice(0, 2)}
          background={undefined}
        />
        <ApplicationCard
          title={{ text: 'applicationCard' }}
          {...attrs as AppCardViewProps}
          actions={actions}
          background={undefined}
        />
        <ApplicationCard
          title={{ text: 'applicationCard' }}
          {...attrsCardWithoutIcon as AppCardViewProps}
          actions={actions}
          background={undefined}
        />
      </div>
    </div>
  );
}
