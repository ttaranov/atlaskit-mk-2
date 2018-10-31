import * as React from 'react';
import { shallow } from 'enzyme';
import { DeactivateUserOverviewScreen } from '../../components/DeactivateUserOverviewScreen';
import { catherineHirons } from '../../mocks/users';
import accessibleSites from '../../mocks/accessibleSites';

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
  shallow(<DeactivateUserOverviewScreen {...defaultProps} {...props} />);

test('DeactivateUserOverviewScreen as Admin', () => {
  expect(render({ isCurrentUser: false })).toMatchSnapshot();
});

test('DeactivateUserOverviewScreen as Self', () => {
  expect(render({ isCurrentUser: true })).toMatchSnapshot();
});
