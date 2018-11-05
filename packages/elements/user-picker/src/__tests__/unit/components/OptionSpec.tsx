import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { components } from '@atlaskit/select';
import { colors } from '@atlaskit/theme';
import { shallow } from 'enzyme';
import * as React from 'react';
import { HighlightText } from '../../../components/HighlightText';
import { Option, TextWrapper } from '../../../components/Option';

describe('Option', () => {
  const data = {
    user: {
      id: 'abc-123',
      name: 'Jace Beleren',
      nickname: 'jbeleren',
      avatarUrl: 'http://avatars.atlassian.com/jace.png',
    },
  };
  const shallowOption = (props = {}) =>
    shallow(<Option data={data} status="approved" {...props} />);

  it('should render Option component', () => {
    const component = shallowOption();
    const defaultOption = component.find(components.Option);
    expect(defaultOption).toHaveLength(1);
    const avatarItem = defaultOption.find(AvatarItem);
    expect(avatarItem.props()).toMatchObject({
      backgroundColor: 'transparent',
      avatar: (
        <Avatar
          src="http://avatars.atlassian.com/jace.png"
          size="medium"
          presence="approved"
          name="Jace Beleren"
          isHover={false}
        />
      ),
      primaryText: <TextWrapper color={colors.N800}>Jace Beleren</TextWrapper>,
      secondaryText: <TextWrapper color={colors.N800}>jbeleren</TextWrapper>,
    });
  });

  it('should render Option in selected state', () => {
    const component = shallowOption({ isSelected: true });
    const defaultOption = component.find(components.Option);
    expect(defaultOption).toHaveLength(1);
    const avatarItem = defaultOption.find(AvatarItem);
    expect(avatarItem.props()).toMatchObject({
      backgroundColor: 'transparent',
      avatar: (
        <Avatar
          src="http://avatars.atlassian.com/jace.png"
          size="medium"
          presence="approved"
          name="Jace Beleren"
          isHover={false}
        />
      ),
      primaryText: <TextWrapper color={colors.N0}>Jace Beleren</TextWrapper>,
      secondaryText: <TextWrapper color={colors.N0}>jbeleren</TextWrapper>,
    });
  });

  it('should highlight text', () => {
    const dataWithHighlight = {
      ...data,
      user: {
        ...data.user,
        highlight: {
          name: [{ start: 0, end: 2 }],
          nickname: [{ start: 2, end: 4 }],
        },
      },
    };
    const component = shallowOption({ data: dataWithHighlight });
    const avatarItem = component.find(AvatarItem);
    expect(avatarItem.props()).toMatchObject({
      primaryText: (
        <TextWrapper color={colors.N800}>
          <HighlightText highlights={[{ start: 0, end: 2 }]}>
            Jace Beleren
          </HighlightText>
        </TextWrapper>
      ),
      secondaryText: (
        <TextWrapper color={colors.N800}>
          <HighlightText highlights={[{ start: 2, end: 4 }]}>
            jbeleren
          </HighlightText>
        </TextWrapper>
      ),
    });
  });

  it('should use nickname if name is not provided', () => {
    const dataWithoutName = {
      user: {
        nickname: 'jbeleren',
        highlight: {
          nickname: [{ start: 2, end: 4 }],
        },
      },
    };
    const component = shallowOption({ data: dataWithoutName });
    const avatarItem = component.find(AvatarItem);
    expect(avatarItem.prop('primaryText')).toEqual(
      <TextWrapper color={colors.N800}>
        <HighlightText highlights={[{ start: 2, end: 4 }]}>
          jbeleren
        </HighlightText>
      </TextWrapper>,
    );
    expect(avatarItem.prop('secondaryText')).toBeUndefined();
  });
});
