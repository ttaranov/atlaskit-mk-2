import * as React from 'react';
import { shallow } from 'enzyme';
import { DeleteUserOverviewScreen } from '../../components/DeleteUserOverviewScreen';
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
  shallow(<DeleteUserOverviewScreen {...defaultProps} {...props} />);

test('DeleteUserOverviewScreen', () => {
  expect(render()).toMatchSnapshot();
});

describe('selectAdminOrSelfCopy', () => {
  test('selects admin copy if delete candidate is not current user', () => {
    const selectAdminOrSelfCopy = (render({
      isCurrentUser: false,
    }).instance() as DeleteUserOverviewScreen).selectAdminOrSelfCopy;
    expect(selectAdminOrSelfCopy('admin', 'self')).toBe('admin');
  });

  test('selects self copy if delete candidate is current user', () => {
    const selectAdminOrSelfCopy = (render({
      isCurrentUser: true,
    }).instance() as DeleteUserOverviewScreen).selectAdminOrSelfCopy;
    expect(selectAdminOrSelfCopy('admin', 'self')).toBe('self');
  });
});
