import * as React from 'react';
import { shallow } from 'enzyme';
import OverviewScreen from '../OverviewScreen';
import { catherineHirons } from '../../../mocks/users';

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
  onNext: jest.fn(),
  onCancel: jest.fn(),
  isLoading: false,
  getAccessibleSites: jest.fn(),
};

const render = (props = {}) =>
  shallow(<OverviewScreen {...defaultProps} {...props} />);

describe('Matches snapshots', () => {
  test('isLoading', () => {
    expect(render({ isLoading: true })).toMatchSnapshot();
  });

  test('!isLoading and no accessible sites', () => {
    expect(
      render({ isLoading: false, accessibleSites: null }),
    ).toMatchSnapshot();
  });

  test('shows accessible sites', () => {
    expect(render()).toMatchSnapshot();
  });
});

describe('selectAdminOrSelfCopy', () => {
  test('selects admin copy if delete candidate is not current user', () => {
    const selectAdminOrSelfCopy = render({ isCurrentUser: false }).instance()
      .selectAdminOrSelfCopy;
    expect(selectAdminOrSelfCopy('admin', 'self')).toBe('admin');
  });

  test('selects self copy if delete candidate is current user', () => {
    const selectAdminOrSelfCopy = render({ isCurrentUser: true }).instance()
      .selectAdminOrSelfCopy;
    expect(selectAdminOrSelfCopy('admin', 'self')).toBe('self');
  });
});
