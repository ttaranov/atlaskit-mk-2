import Select from '@atlaskit/select';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Props, UserPicker } from '../../../components/UserPicker';
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
      { value: users[0], label: 'Jace Beleren' },
      { value: users[1], label: 'Chandra Nalaar' },
    ]);
    const styles: Styles = select.prop('styles');
    expect(styles.menu({})).toMatchObject({
      width: 350,
    });

    expect(styles.control({})).toMatchObject({
      width: 350,
      height: 60,
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
      height: 60,
    });
  });

  it('should trigger onChange with User', () => {
    const onChange = jest.fn();
    const component = shallowUserPicker({ onChange });

    const select = component.find(Select);
    select.simulate('change', { value: users[0] }, { action: 'select-option' });

    expect(onChange).toHaveBeenCalledWith(users[0], 'select-option');
  });
});
