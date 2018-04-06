import * as React from 'react';
import { shallow } from 'enzyme';
import {
  PredefinedAvatarView,
  PredefinedAvatarViewProps,
} from '../src/predefined-avatar-view';

describe('PredefinedAvatarView', () => {
  const setup = (props?: Partial<PredefinedAvatarViewProps>) => {
    const component = shallow(
      <PredefinedAvatarView
        avatars={[]}
        onAvatarSelected={null as any}
        {...props}
      />,
    );

    return {
      component,
    };
  };

  describe('header text', () => {
    it('should use different caption text when predefinedAvatarsText is passed', () => {
      const { component } = setup();

      expect(component.find('.description').text()).toEqual('Default avatars');
      component.setProps({
        predefinedAvatarsText: 'default icons',
      });
      expect(component.find('.description').text()).toEqual('default icons');
    });
  });
});
