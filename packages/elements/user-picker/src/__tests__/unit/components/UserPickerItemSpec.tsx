import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge';
import { shallow } from 'enzyme';
import * as React from 'react';
import { HighlightText } from '../../../components/HighlightText';
import UserPickerItem, { Props } from '../../../components/UserPickerItem';

describe('UserPickerItem', () => {
  const user = {
    id: 'some-id',
    name: 'Jace Beleren',
    nickname: 'jbeleren',
  };

  const avatarUrl =
    'https://pm1.narvii.com/6388/f125d3f6c16954b4018bc599ac52c7d5295166c6_128.jpg';

  const shallowUserPickerItem = (props: Partial<Props> = {}) =>
    shallow(<UserPickerItem user={user} {...props} />);

  describe('UserPickerItem', () => {
    it('should render UserPickerItem', () => {
      const component = shallowUserPickerItem();

      expect(component.find(Lozenge)).toHaveLength(0);
      const avatarItem = component.find(AvatarItem);
      expect(avatarItem.props()).toMatchObject({
        backgroundColor: 'transparent',
        avatar: <Avatar size="medium" name="Jace Beleren" />,
        primaryText: 'Jace Beleren',
        secondaryText: 'jbeleren',
      });
    });
  });

  describe('name', () => {
    it('should use name and nickname as text to display', () => {
      const component = shallowUserPickerItem();
      const item = component.find(AvatarItem);
      expect(item.prop('primaryText')).toEqual('Jace Beleren');
      expect(item.prop('secondaryText')).toEqual('jbeleren');
    });

    it('should use nickname as primaryText if no name present', () => {
      const unnamedUser = {
        ...user,
        name: undefined,
      };
      const component = shallowUserPickerItem({ user: unnamedUser });
      const item = component.find(AvatarItem);
      expect(item.prop('primaryText')).toEqual('jbeleren');
      expect(item.prop('secondaryText')).toBeFalsy();
    });
  });

  describe('lozenge', () => {
    it('should not render lozenge for basic user', () => {
      const component = shallowUserPickerItem({ context: 'menu' });

      expect(component.find(Lozenge)).toHaveLength(0);
    });

    it('should render tag if lozenge prop passed in', () => {
      const component = shallowUserPickerItem({
        user: { ...user, lozenge: 'app' },
        context: 'menu',
      });

      const lozenge = component.find(Lozenge);
      expect(lozenge).toHaveLength(1);
      expect(lozenge.prop('children')).toEqual('app');
    });

    it('should not render lozenge if empty string', () => {
      const component = shallowUserPickerItem({
        user: { ...user, lozenge: '' },
        context: 'menu',
      });

      expect(component.find(Lozenge)).toHaveLength(0);
    });
  });

  describe('avatar', () => {
    it('should render avatar', () => {
      const component = shallowUserPickerItem({
        user: {
          ...user,
          avatarUrl,
        },
        status: 'offline',
      });

      expect(component.find(AvatarItem).prop('avatar')).toEqual(
        <Avatar
          src={avatarUrl}
          size="medium"
          presence="offline"
          name="Jace Beleren"
        />,
      );
    });

    it('should handle empty avatarUrl', () => {
      const component = shallowUserPickerItem({
        user: {
          ...user,
          avatarUrl: '',
        },
      });

      expect(component.find(AvatarItem).prop('avatar')).toMatchObject(
        <Avatar src="" size="medium" name="Jace Beleren" />,
      );
    });
  });

  describe('highlights', () => {
    it('should set highlights for name and nickname', () => {
      const name = [{ start: 0, end: 2 }];
      const nickname = [{ start: 4, end: 6 }];
      const component = shallowUserPickerItem({
        user: {
          ...user,
          avatarUrl,
          highlight: { name, nickname },
        },
        status: 'offline',
        context: 'menu',
      });

      expect(component.find(AvatarItem).prop('primaryText')).toEqual(
        <HighlightText highlights={name}>Jace Beleren</HighlightText>,
      );

      expect(component.find(AvatarItem).prop('secondaryText')).toEqual(
        <HighlightText highlights={nickname}>jbeleren</HighlightText>,
      );
    });
  });
});
