import React from 'react';
import { shallow } from 'enzyme';
import OverviewScreen from '../OverviewScreen';

jest.mock('@atlaskit/button', () => ({
  __esModule: true,
  default: 'Button',
  ButtonGroup: 'ButtonGroup',
}));

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

const props = {
  accessibleSites,
  isCurrentUser: false,
  user: catherineHirons,
  onNext: jest.fn(),
  onCancel: jest.fn(),
  isLoading: false,
  getAccessibleSites: jest.fn(),
};

test('matches snapshot', () => {
  expect(shallow(<OverviewScreen {...props} />)).toMatchSnapshot();
});
