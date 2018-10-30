// @flow

import React from 'react';
import { shallow } from 'enzyme';

import { ContainerNavigationMask } from '../../primitives';

describe('LayoutManager primitives', () => {
  describe('ContainerNavigationMask', () => {
    it('should render correctly with default props', () => {
      const wrapper = shallow(<ContainerNavigationMask />);

      expect(wrapper).toMatchSnapshot();
    });

    it('should set pointerEvents to none while dragging', () => {
      const wrapper = shallow(<ContainerNavigationMask isItemDragging />);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
