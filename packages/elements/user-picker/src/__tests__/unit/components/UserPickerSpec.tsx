jest.mock('../../../components/styles', () => ({
  getStyles: jest.fn(),
}));

import Select from '@atlaskit/select';
import { shallow } from 'enzyme';
import * as debounce from 'lodash.debounce';
import * as React from 'react';
import { getStyles } from '../../../components/styles';
import { Props, UserPicker } from '../../../components/UserPicker';
import { User } from '../../../types';

describe('UserPicker', () => {
  const shallowUserPicker = (props: Partial<Props> = {}) =>
    shallow(<UserPicker {...props} />);

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

  it('should render Select', () => {
    const component = shallowUserPicker({ users });
    const select = component.find(Select);
    expect(select.prop('options')).toEqual([
      { value: 'abc-123', user: users[0], label: 'Jace Beleren' },
      { value: '123-abc', user: users[1], label: 'Chandra Nalaar' },
    ]);
    expect(getStyles).toHaveBeenCalledWith(350);
    expect(select.prop('menuPlacement')).toBeTruthy();
  });

  it('should set width', () => {
    shallowUserPicker({ width: 500 });

    expect(getStyles).toHaveBeenCalledWith(500);
  });

  it('should trigger onChange with User', () => {
    const onChange = jest.fn();
    const component = shallowUserPicker({ onChange });

    const select = component.find(Select);
    select.simulate(
      'change',
      { value: 'abc-123', user: users[0] },
      { action: 'select-option' },
    );

    expect(onChange).toHaveBeenCalledWith(users[0], 'select-option');
  });

  it('should trigger props.onSelection if onChange with select-option action', () => {
    const onSelection = jest.fn();
    const component = shallowUserPicker({ onSelection });

    const select = component.find(Select);
    select.simulate(
      'change',
      { value: 'abc-123', user: users[0] },
      { action: 'select-option' },
    );

    expect(onSelection).toHaveBeenCalledWith(users[0]);
  });

  describe('Multiple users select', () => {
    it('should set isMulti in Select', () => {
      const component = shallowUserPicker({ users, isMulti: true });
      const select = component.find(Select);
      expect(select.prop('isMulti')).toBeTruthy();
    });

    it('should call onChange with an array of users', () => {
      const onChange = jest.fn();
      const component = shallowUserPicker({ users, isMulti: true, onChange });

      component
        .find(Select)
        .simulate(
          'change',
          [
            { value: 'abc-123', user: users[0] },
            { value: '123-abc', user: users[1] },
          ],
          { action: 'select-option' },
        );

      expect(onChange).toHaveBeenCalledWith(
        [users[0], users[1]],
        'select-option',
      );
    });
  });

  it('should set hovering clear indicator', () => {
    const component = shallowUserPicker();
    const select = component.find(Select);
    select.simulate('clearIndicatorHover', true);
    expect(component.state()).toHaveProperty('hoveringClearIndicator', true);
  });

  it('should open menu onFocus', () => {
    const component = shallowUserPicker();
    const select = component.find(Select);
    select.simulate('focus');
    expect(component.state()).toHaveProperty('menuIsOpen', true);
  });

  it('should close menu onBlur', () => {
    const component = shallowUserPicker();
    component.setState({ menuIsOpen: true });
    const select = component.find(Select);
    select.simulate('blur');
    expect(component.state()).toHaveProperty('menuIsOpen', false);
  });

  describe('async load', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('should load users when picker open', () => {
      const usersPromise = new Promise<User[]>(resolve =>
        setTimeout(() => resolve(users), 500),
      );
      const loadUsers = jest.fn(() => usersPromise);
      const component = shallowUserPicker({ loadUsers });
      component.setProps({ open: true });
      jest.runAllTimers();
      expect(loadUsers).toHaveBeenCalled();
      return usersPromise.then(() => {
        jest.runAllTimers();
        expect(component.state()).toMatchObject({
          users,
        });
      });
    });

    describe('onInputChange', () => {
      it('should load users on input change', () => {
        const usersPromise = new Promise<User[]>(resolve =>
          setTimeout(() => resolve(users), 500),
        );
        const loadUsers = jest.fn(() => usersPromise);
        const component = shallowUserPicker({ loadUsers });
        const select = component.find(Select);
        select.simulate('inputChange', 'some text', { action: 'input-change' });
        jest.runAllTimers();
        expect(loadUsers).toHaveBeenCalled();
        expect(loadUsers).toHaveBeenCalledWith('some text');
        return usersPromise.then(() => {
          jest.runAllTimers();
          expect(component.state()).toMatchObject({
            users,
          });
        });
      });

      it('should call props.onInputChange', () => {
        const onInputChange = jest.fn();
        const component = shallowUserPicker({ onInputChange });
        const select = component.find(Select);
        select.simulate('inputChange', 'some text', { action: 'input-change' });
        expect(onInputChange).toHaveBeenCalled();
      });

      it('should debounce input change events', () => {
        const usersPromise = new Promise<User[]>(resolve =>
          setTimeout(() => resolve(users), 500),
        );
        const loadUsers = jest.fn(() => usersPromise);
        shallowUserPicker({ loadUsers });

        expect(debounce).toHaveBeenCalledWith(expect.any(Function), 200);
      });
    });
  });
});
