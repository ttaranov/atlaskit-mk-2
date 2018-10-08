import Droplist from '@atlaskit/droplist';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Props, UserPicker } from '../../components/UserPicker';
import { PickerStyle } from '../../components/UserPicker/styles';
import UserPickerItem from '../../components/UserPickerItem';
import { User } from '../../types';

const Trigger = () => <div>Hey I'm a trigger</div>;
const users: User[] = [
  {
    id: 'abc-123',
    name: 'Jace Beleren',
    nickname: 'jbeleren',
  },
  {
    id: '123-abc',
    name: 'Chandra Nalaar',
    nickname: 'cnalaar',
  },
];

describe('UserPicker', () => {
  const shallowUserPicker = (props: Partial<Props>) =>
    shallow(<UserPicker trigger={<Trigger />} {...props} />);

  it('should render Droplist', () => {
    const trigger = <Trigger />;
    const component = shallowUserPicker({ trigger });
    const droplist = component.find(Droplist);

    expect(droplist.props()).toMatchObject({
      trigger,
      isOpen: false,
      isLoading: true,
      shouldFitContainer: true,
      boundariesElement: 'viewport',
    });
  });

  it('should wrap droplist with width', () => {
    const component = shallowUserPicker({ width: 500 });

    const pickerStyle = component.find(PickerStyle);
    expect(pickerStyle.prop('width')).toBe(500);
    expect(pickerStyle.find(Droplist)).toHaveLength(1);
  });

  it('should open Droplist when the UserPicker is open', () => {
    const component = shallowUserPicker({ open: true });
    const droplist = component.find(Droplist);
    expect(droplist.prop('isOpen')).toBeTruthy();
  });

  it('should call onRequestClose when open change to false', () => {
    const onRequestClose = jest.fn();
    const component = shallowUserPicker({ onRequestClose });
    component.find(Droplist).simulate('openChange', { isOpen: false });
    expect(onRequestClose).toHaveBeenCalled();
  });

  it('should show loading state if users is undefined', () => {
    const component = shallowUserPicker({ users: undefined });
    const droplist = component.find(Droplist);
    expect(droplist.prop('isLoading')).toBeTruthy();
  });

  it('should pass onSelection prop to UserPickerItem', () => {
    const onSelection = jest.fn();
    const component = shallowUserPicker({ users, onSelection });
    const droplist = component.find(Droplist);
    expect(
      droplist
        .find(UserPickerItem)
        .at(0)
        .prop('onSelection'),
    ).toEqual(onSelection);
  });

  describe('with users', () => {
    it('should render empty user list', () => {
      const component = shallowUserPicker({ users: [] });

      const droplist = component.find(Droplist);
      expect(droplist.prop('isOpen')).toBeFalsy();
      expect(droplist.find(UserPickerItem)).toHaveLength(0);
    });

    it('should render some users', () => {
      const component = shallowUserPicker({ users });

      const droplist = component.find(Droplist);
      expect(droplist.prop('isOpen')).toBeFalsy();

      const userItems = droplist.find(UserPickerItem);
      expect(userItems).toHaveLength(2);
      expect(userItems.at(0).prop('user')).toBe(users[0]);
      expect(userItems.at(1).prop('user')).toBe(users[1]);
    });
  });
});
