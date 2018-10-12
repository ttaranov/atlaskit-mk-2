import React from 'react';
import { storiesOf } from '@storybook/react';
import OverviewScreen from '../OverviewScreen';

const catherineHirons = {
  id: 'chirons',
  fullName: 'Catherine Hirons',
  email: 'catherine.hirons@acme.com',
};

const accessibleSites = {
  sites: [
    {
      cloudId: 'a436116f-02ce-4520-8fbb-7301462a1674',
      url: 'https://hello.atlassian.net',
      products: ['hipchat.cloud'],
      avatarUrl:
        'https://static.stride.com/default-site-avatars/atlassian-avatar.png',
      displayName: 'hello',
      isVertigo: true,
    },
    {
      cloudId: 'a436116f-02ce-4520-8fbb-7301462a1674',
      url: 'https://acme.atlassian.net',
      products: ['hipchat.cloud'],
      avatarUrl:
        'https://static.stride.com/default-site-avatars/atlassian-avatar.png',
      displayName: 'hello',
      isVertigo: true,
    },
    {
      cloudId: 'a436116f-02ce-4520-8fbb-7301462a1674',
      url: 'https://test.atlassian.net',
      products: ['hipchat.cloud'],
      avatarUrl:
        'https://static.stride.com/default-site-avatars/atlassian-avatar.png',
      displayName: 'hello',
      isVertigo: true,
    },
  ],
};

const defaultProps = {
  accessibleSites,
  isCurrentUser: false,
  user: catherineHirons,
  onNext: () => null,
  onCancel: () => null,
  getAccessibleSites: () => null,
  isLoading: false,
};

storiesOf(
  'Common|Components/RightToBeForgottenFocusedTask/OverviewScreen',
  module,
)
  .add('IsLoading test', () => <OverviewScreen {...defaultProps} isLoading />)
  .add('Managed', () => <OverviewScreen {...defaultProps} />)
  .add('Self', () => <OverviewScreen {...defaultProps} isCurrentUser />);
