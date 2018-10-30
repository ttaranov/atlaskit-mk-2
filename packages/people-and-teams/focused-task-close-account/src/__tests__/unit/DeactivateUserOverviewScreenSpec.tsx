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

test('DeactivateUserOverviewScreen', () => {
  expect(render()).toMatchSnapshot();
});

describe('selectAdminOrSelfCopy', () => {
  test('selects admin copy if deactivate candidate is not current user', () => {
    const selectAdminOrSelfCopy = (render({
      isCurrentUser: false,
    }).instance() as DeactivateUserOverviewScreen).selectAdminOrSelfCopy;
    expect(selectAdminOrSelfCopy('admin', 'self')).toBe('admin');
  });

  test('selects self copy if deactivate candidate is current user', () => {
    const selectAdminOrSelfCopy = (render({
      isCurrentUser: true,
    }).instance() as DeactivateUserOverviewScreen).selectAdminOrSelfCopy;
    expect(selectAdminOrSelfCopy('admin', 'self')).toBe('self');
  });
});
