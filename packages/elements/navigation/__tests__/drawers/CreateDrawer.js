// @flow
import { mount } from 'enzyme';
import React from 'react';
import { AkCreateDrawer } from '../../src/index';
import { drawerIconOffset } from '../../src/shared-variables';
import Drawer from '../../src/components/js/Drawer';
import requiredProps from '../_drawer-util';

describe('<CreateDrawer />', () => {
  describe('the inner Drawer', () => {
    it('isFullWidth should pass width="full" to the inner drawer', () => {
      expect(
        mount(<AkCreateDrawer {...requiredProps} isFullWidth />)
          .find(Drawer)
          .props().width,
      ).toBe('full');
    });
    it('isFullWidth={false} should pass width="narrow" to the inner drawer', () => {
      expect(
        mount(<AkCreateDrawer {...requiredProps} isFullWidth={false} />)
          .find(Drawer)
          .props().width,
      ).toBe('narrow');
    });
    it('should render the backIcon in the correct position default to false', () => {
      expect(
        mount(<AkCreateDrawer {...requiredProps} />)
          .find(Drawer)
          .props().iconOffset,
      ).toBe(drawerIconOffset);
    });
  });
});
