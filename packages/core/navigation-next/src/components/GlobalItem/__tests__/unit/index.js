// @flow

import React from 'react';
import { shallow } from 'enzyme';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';

import InteractionStateManager from '../../../InteractionStateManager';
import GlobalItem, { GlobalItemBase } from '../../index';
import GlobalItemPrimitive from '../../primitives';

const theme: any = {
  mode: {
    globalItem: jest.fn(({ size }) => ({
      itemBase: {},
      badgeWrapper: {},
      itemWrapper: {
        marginTop: size === 'large' ? 10 : 0,
      },
    })),
  },
};

describe('GlobalItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(<GlobalItem icon={AtlassianIcon} />);

    expect(wrapper).toMatchSnapshot();
  });

  describe('GlobalItemBase', () => {
    it('should render an InteractionStateManager', () => {
      const wrapper = shallow(
        <GlobalItemBase theme={theme} icon={AtlassianIcon} />,
      );

      expect(wrapper.find(InteractionStateManager)).toHaveLength(1);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render the GlobalItem primitive', () => {
      const wrapper = shallow(
        <GlobalItemBase theme={theme} icon={AtlassianIcon} />,
      );

      const renderChildren = wrapper.find('InteractionStateManager').dive();

      const primitive = renderChildren.find(GlobalItemPrimitive);

      expect(primitive).toHaveLength(1);
      expect(primitive).toMatchSnapshot();
    });

    it('should render an item wrapper with the globalItem.itemWrapper theme styles when size is large', () => {
      const largeItem = shallow(
        <GlobalItemBase theme={theme} icon={AtlassianIcon} size="large" />,
      );

      expect(theme.mode.globalItem).toHaveBeenCalledWith({ size: 'large' });
      expect(largeItem).toMatchSnapshot('largeItem');
    });

    it('should render an item wrapper with the globalItem.itemWrapper theme styles when size is small', () => {
      const smallItem = shallow(
        <GlobalItemBase theme={theme} icon={AtlassianIcon} size="small" />,
      );

      expect(theme.mode.globalItem).toHaveBeenCalledWith({ size: 'small' });
      expect(smallItem).toMatchSnapshot('smallItem');
    });
  });
});
