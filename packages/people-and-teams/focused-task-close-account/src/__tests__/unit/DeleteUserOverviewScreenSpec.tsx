import * as React from 'react';
import { shallow } from 'enzyme';
import { DeleteUserOverviewScreen } from '../../components/DeleteUserOverviewScreen';
import { catherineHirons } from '../../mocks/users';
import accessibleSites from '../../mocks/accessibleSites';
import { DeleteUserOverviewScreenProps } from '../../components/DeleteUserOverviewScreen/types';

const defaultProps: Partial<DeleteUserOverviewScreenProps> = {
  accessibleSites,
  isCurrentUser: false,
  user: catherineHirons,
};

const render = (props = {}) =>
  shallow(<DeleteUserOverviewScreen {...defaultProps} {...props} />);

test('DeleteUserOverviewScreen', () => {
  expect(
    render({
      deactivateUserHandler: () => {},
    }),
  ).toMatchSnapshot();
});

describe('selectAdminOrSelfCopy', () => {
  test('selects admin copy if delete candidate is not current user', () => {
    const selectAdminOrSelfCopy = (render({
      deactivateUserHandler: () => {},
      isCurrentUser: false,
    }).instance() as DeleteUserOverviewScreen).selectAdminOrSelfCopy;
    expect(selectAdminOrSelfCopy('admin', 'self')).toBe('admin');
  });

  test('selects self copy if delete candidate is current user', () => {
    const selectAdminOrSelfCopy = (render({
      deactivateUserHandler: () => {},
      isCurrentUser: true,
    }).instance() as DeleteUserOverviewScreen).selectAdminOrSelfCopy;
    expect(selectAdminOrSelfCopy('admin', 'self')).toBe('self');
  });
});

describe('accessibleSites display', () => {
  test('text displayed is different when no accessibleSites prop is passed', () => {
    expect(
      render({
        deactivateUserHandler: () => {},
        accessibleSites: [],
      }),
    ).toMatchSnapshot();
  });
});

describe('deactivateUserHandler display', () => {
  test('warning section is not displayed if the deactivateUserHandler prop is not passed', () => {
    expect(render()).toMatchSnapshot();
  });
});
