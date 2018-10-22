import Select from '@atlaskit/select';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Props, UserPicker } from '../../../components/UserPicker';
import UserPickerItem from '../../../components/UserPickerItem';
import { User } from '../../../types';

type Styles = {
  [key: string]: <T extends {}>(css: T) => T;
};

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
    const styles: Styles = select.prop('styles');
    expect(styles.menu({})).toMatchObject({
      width: 350,
    });

    expect(styles.control({})).toMatchObject({
      width: 350,
      flexWrap: 'nowrap',
    });

    expect(styles.input({})).toMatchObject({
      lineHeight: '44px',
    });

    expect(styles.valueContainer({})).toMatchObject({
      flexGrow: 1,
      overflow: 'hidden',
    });
  });

  it('should set width', () => {
    const component = shallowUserPicker({ width: 500 });

    const select = component.find(Select);
    const styles: Styles = select.prop('styles');
    expect(styles.menu({})).toMatchObject({
      width: 500,
    });

    expect(styles.control({})).toMatchObject({
      width: 500,
      flexWrap: 'nowrap',
    });
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

  it('should render UserPickerItem as label', () => {
    const component = shallowUserPicker({ users });
    const formatOptionLabel: Function = component
      .find(Select)
      .prop('formatOptionLabel');

    expect(
      formatOptionLabel(
        { id: 'abc-123', user: users[0], label: 'Jace Beleren' },
        { context: 'menu' },
      ),
    ).toEqual(<UserPickerItem user={users[0]} context="menu" />);
  });

  describe('Multiple users select', () => {
    it('should set isMulti in Select', () => {
      const component = shallowUserPicker({ users, isMulti: true });
      const select = component.find(Select);
      expect(select.prop('isMulti')).toBeTruthy();

      const styles: Styles = select.prop('styles');
      expect(styles.multiValue({})).toMatchObject({
        borderRadius: 24,
      });

      expect(styles.multiValueRemove({})).toMatchObject({
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      });
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
});
