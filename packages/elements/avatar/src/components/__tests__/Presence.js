// @flow
import React from 'react';
import { shallow, mount } from 'enzyme';

import Presence from '../Presence';
import getPresenceSVG from '../../helpers/getPresenceSVG';

const PRESENCE_TYPES = ['busy', 'focus', 'offline', 'online'];

describe('Avatar', () => {
  describe('Presence', () => {
    PRESENCE_TYPES.forEach(presence =>
      describe(`when presence is ${presence}`, () =>
        it('should render content', () => {
          // eslint-disable-next-line chai-expect/missing-assertion
          expect(
            shallow(<Presence presence={presence} />).type(
              getPresenceSVG(presence),
            ),
          ).toBeTruthy();
        })),
    );

    it('should render children if provided', () => {
      const wrapper = shallow(
        <Presence presence={PRESENCE_TYPES[0]}>
          <span className="child" />
        </Presence>,
      );
      expect(wrapper.find(Presence).length).toBe(0);
      expect(wrapper.find('span').length).toBe(1);
      expect(wrapper.find('span').hasClass('child')).toBe(true);
    });

    describe('borderColor prop', () => {
      // TODO: this is no longer correct now we have dark mode...
      //       is there a better tests we could add?
      it.skip('should be white by default', () => {
        // eslint-disable-line jest/no-disabled-tests
        const wrapper = mount(<Presence presence="online" />);
        expect(wrapper.prop('borderColor')).toBe('#FFFFFF');
      });

      // TODO: come back to this
      it.skip('should reflect the prop as a CSS style property', () => {
        // eslint-disable-line jest/no-disabled-tests
        const wrapper = mount(
          <Presence presence="online" borderColor="#FF0000" />,
        );
        const bgColor = wrapper.getDOMNode().style.backgroundColor;
        expect(bgColor).toBe('#FF0000');
      });
    });
  });
});
