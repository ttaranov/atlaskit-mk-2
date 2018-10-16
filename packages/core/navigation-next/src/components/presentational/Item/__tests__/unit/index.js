// @flow

import React from 'react';
import { shallow } from 'enzyme';
import InteractionStateManager from '../../../InteractionStateManager';
import Item, { ConnectedItem } from '../../index';
import ItemPrimitive from '../../primitives';

describe('Item', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should render correctly', () => {
    const wrapper = shallow(<Item text="My item" />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should wrap ConnectedItem with navigationItemClicked HOC', () => {
    const mockNavigationItemClicked = jest.fn(() => () => null);
    jest.doMock('../../../../common/analytics', () => ({
      navigationItemClicked: mockNavigationItemClicked,
    }));
    const { ConnectedItem: RequiredConnectedItem } = require('../../index');

    expect(mockNavigationItemClicked).toHaveBeenCalledWith(
      RequiredConnectedItem,
      'item',
    );
  });

  describe('ConnectedItem', () => {
    it('should render an InteractionStateManager', () => {
      const wrapper = shallow(<ConnectedItem text="My item" />);

      expect(wrapper.find(InteractionStateManager)).toHaveLength(1);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render the Item primitive', () => {
      const wrapper = shallow(<ConnectedItem text="My item" />);

      const renderChildren = wrapper.find(InteractionStateManager).dive();

      const primitive = renderChildren.find(ItemPrimitive);

      expect(primitive).toHaveLength(1);
      expect(primitive).toMatchSnapshot();
    });
  });
});
