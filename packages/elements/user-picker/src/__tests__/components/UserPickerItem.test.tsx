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

  it('should render UserPickerItem', () => {
    const component = shallowUserPickerItem();

    const item = component.find(Item);
    expect(item.prop('elemAfter')).toBeUndefined();
    const avatarItem = item.find(AvatarItem);
    expect(avatarItem.props()).toMatchObject({
      backgroundColor: 'transparent',
      avatar: <Avatar size="medium" />,
      primaryText: expect.objectContaining(
        <HighlightText>Jace Beleren</HighlightText>,
      ),
      secondaryText: expect.objectContaining(
        <HighlightText>jbeleren</HighlightText>,
      ),
    });
  });

  it('should use name and nickname as text to display', () => {
    const component = shallowUserPickerItem();
    const item = component.find(AvatarItem);
    expect(item.html()).toContain('Jace Beleren');
    expect(item.html()).toContain('jbeleren');
  });

  it('should render lozenge', () => {
    const component = shallowUserPickerItem({
      user: { ...user, lozenge: 'app' },
    });

    const item = component.find(Item);
    expect(item.prop('elemAfter')).toEqual(<Lozenge>app</Lozenge>);
  });

  it('should render avatar', () => {
    const component = shallowUserPickerItem({
      user: {
        ...user,
        avatarUrl,
      },
      status: 'offline',
    });

    expect(component.find(AvatarItem).prop('avatar')).toEqual(
      <Avatar src={avatarUrl} size="medium" presence="offline" />,
    );
  });

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
