import Avatar, { AvatarItem } from '@atlaskit/avatar';
import Item from '@atlaskit/item';
import Lozenge from '@atlaskit/lozenge';
import { shallow } from 'enzyme';
import * as React from 'react';
import { HighlightText } from '../../components/HighlightText';
import UserPickerItem, { Props } from '../../components/UserPickerItem';

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

      const item = component.find(Item);
      expect(item.prop('elemAfter')).toBeUndefined();
      const avatarItem = item.find(AvatarItem);
      expect(avatarItem.props()).toMatchObject({
        backgroundColor: 'transparent',
        avatar: <Avatar size="medium" name="Jace Beleren" />,
        primaryText: expect.objectContaining(
          <HighlightText>Jace Beleren</HighlightText>,
        ),
        secondaryText: expect.objectContaining(
          <HighlightText>jbeleren</HighlightText>,
        ),
      });
    });
  });

  describe('name', () => {
    it('should use name and nickname as text to display', () => {
      const component = shallowUserPickerItem();
      const item = component.find(AvatarItem);
      expect(item.prop('primaryText')).toMatchObject(
        <HighlightText>Jace Beleren</HighlightText>,
      );
      expect(item.prop('secondaryText')).toMatchObject(
        <HighlightText>jbeleren</HighlightText>,
      );
    });

    it('should use nickname as primaryText if no name present', () => {
      const unnamedUser = {
        ...user,
        name: undefined,
      };
      const component = shallowUserPickerItem({ user: unnamedUser });
      const item = component.find(AvatarItem);
      expect(item.prop('primaryText')).toMatchObject(
        <HighlightText>jbeleren</HighlightText>,
      );
      expect(item.prop('secondaryText')).toBeFalsy();
    });
  });

  describe('lozenge', () => {
    it('should not render lozenge for basic user', () => {
      const component = shallowUserPickerItem();

      const item = component.find(Item);
      expect(item.find(Lozenge)).toHaveLength(0);
    });

    it('should render tag if lozenge prop passed in', () => {
      const component = shallowUserPickerItem({
        user: { ...user, badge: 'app' },
      });

      const item = component.find(Item);
      expect(item.prop('elemAfter')).toEqual(<Lozenge>app</Lozenge>);
    });

    it('should not render lozenge if empty string', () => {
      const component = shallowUserPickerItem({
        user: { ...user, badge: '' },
      });

      const item = component.find(Item);
      expect(item.prop('elemAfter')).toBeFalsy();
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
      });

      expect(component.find(AvatarItem).prop('primaryText')).toEqual(
        <HighlightText highlights={name}>Jace Beleren</HighlightText>,
      );

      expect(component.find(AvatarItem).prop('secondaryText')).toEqual(
        <HighlightText highlights={nickname}>jbeleren</HighlightText>,
      );
    });
  });

  describe('onSelection', () => {
    it('should call onSelection prop onClick', () => {
      const onSelection = jest.fn();
      const component = shallowUserPickerItem({ onSelection });

      const item = component.find(Item);
      item.simulate('click');
      expect(onSelection.mock.calls).toHaveLength(1);
    });

    it('should call onSelection with user', () => {
      const onSelection = jest.fn();
      const component = shallowUserPickerItem({ onSelection });

      const item = component.find(Item);
      item.simulate('click');
      expect(onSelection.mock.calls[0][0]).toEqual(user);
    });
  });
});
