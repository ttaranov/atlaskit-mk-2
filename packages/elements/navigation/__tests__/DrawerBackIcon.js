// @flow
import { shallow } from 'enzyme';
import React from 'react';
import DrawerBackIcon from '../src/components/js/DrawerBackIcon';
import DrawerBackIconInner from '../src/components/styled/DrawerBackIconInner';

describe('<DrawerBackIcon />', () => {
  describe('props', () => {
    it('renders children', () => {
      const icon = <em>test</em>;
      expect(
        shallow(<DrawerBackIcon>{icon}</DrawerBackIcon>).contains(icon),
      ).toBe(true);
    });
    it('isVisible controls the presence of the isVisible class', () => {
      const visibleIcon = shallow(
        <DrawerBackIcon isVisible>icon</DrawerBackIcon>,
      );
      const invisibleIcon = shallow(<DrawerBackIcon>icon</DrawerBackIcon>);

      expect(visibleIcon.find(DrawerBackIconInner).props().isVisible).toBe(
        true,
      );
      expect(invisibleIcon.find(DrawerBackIconInner).props().isVisible).toBe(
        false,
      );
    });
  });
});
