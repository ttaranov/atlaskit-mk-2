import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { shallow } from 'enzyme';
import * as React from 'react';
import { SingleValue } from '../../../components/SingleValue';

describe('SingleValue', () => {
  const data = {
    user: {
      id: 'abc-123',
      name: 'Jace Beleren',
      nickname: 'jbeleren',
      avatarUrl: 'http://avatars.atlassian.com/jace.png',
    },
  };

  const selectProps = {
    appearance: 'normal',
  };

  const shallowSingleValue = (props = {}) =>
    shallow(<SingleValue data={data} selectProps={selectProps} {...props} />);

  it('should render SingleValue', () => {
    const component = shallowSingleValue();
    expect(component.find(AvatarItem).props()).toMatchObject({
      backgroundColor: 'transparent',
      primaryText: 'Jace Beleren',
      avatar: (
        <Avatar
          src="http://avatars.atlassian.com/jace.png"
          size="small"
          name="Jace Beleren"
          isHover={false}
        />
      ),
    });
  });

  it('should render SingleValue with nickname when name is not defined', () => {
    const component = shallowSingleValue({
      data: {
        user: { nickname: 'jbeleren' },
      },
    });
    expect(component.find(AvatarItem).props()).toMatchObject({
      backgroundColor: 'transparent',
      primaryText: 'jbeleren',
      avatar: <Avatar size="small" name="jbeleren" isHover={false} />,
    });
  });

  it('should render Avatar as xsmall when the appearance is compact', () => {
    const component = shallowSingleValue({
      selectProps: {
        appearance: 'compact',
      },
    });
    expect(component.find(AvatarItem).props()).toMatchObject({
      backgroundColor: 'transparent',
      primaryText: 'Jace Beleren',
      avatar: (
        <Avatar
          src="http://avatars.atlassian.com/jace.png"
          size="xsmall"
          name="Jace Beleren"
          isHover={false}
        />
      ),
    });
  });
});
