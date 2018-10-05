// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';
import cloneDeep from 'lodash.clonedeep';
import ChevronLeft from '@atlaskit/icon/glyph/chevron-left';
import { ResizeControlBase } from '../../ResizeControl';
import { navigationExpandedCollapsed } from '../../../../common/analytics';

jest.mock('../../../../common/analytics', () => ({
  navigationExpandedCollapsed: jest.fn(),
}));

describe('ResizeControlBase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  const resizeControlProps = {
    collapseToggleTooltipContent: () => ({ text: '', char: '' }),
    createAnalyticsEvent: (() => ({ fire: Function.prototype }): any),
    expandCollapseAffordanceRef: { current: null },
    experimental_flyoutOnHover: false,
    flyoutIsOpen: false,
    isDisabled: false,
    mouseIsOverNavigation: false,
    mutationRefs: [],
    navigation: {
      state: {
        isCollapsed: false,
      },
      manualResizeStart: Function.prototype,
      toggleCollapse: Function.prototype,
    },
  };

  it('should render correctly', () => {
    const wrapper = shallow(
      <ResizeControlBase {...resizeControlProps}>
        {() => null}
      </ResizeControlBase>,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should call navigationExpandedCollapsed with chevronHover trigger when clicking on chevron while flyout is open', () => {
    const props = cloneDeep(resizeControlProps);
    props.navigation.state.isCollapsed = false;

    const wrapper = mount(
      <ResizeControlBase {...resizeControlProps} flyoutIsOpen>
        {() => null}
      </ResizeControlBase>,
    );

    wrapper.find(ChevronLeft).simulate('click');

    expect(navigationExpandedCollapsed).toHaveBeenCalledTimes(1);
    expect(navigationExpandedCollapsed).toHaveBeenCalledWith(
      resizeControlProps.createAnalyticsEvent,
      {
        trigger: 'chevronHover',
        isCollapsed: true,
      },
    );
  });

  it('should call navigationExpandedCollapsed with chevron trigger when clicking on chevron while flyout is not open', () => {
    const props = cloneDeep(resizeControlProps);
    props.navigation.state.isCollapsed = false;

    const wrapper = mount(
      <ResizeControlBase {...resizeControlProps} flyoutIsOpen={false}>
        {() => null}
      </ResizeControlBase>,
    );

    wrapper.find(ChevronLeft).simulate('click');

    expect(navigationExpandedCollapsed).toHaveBeenCalledTimes(1);
    expect(navigationExpandedCollapsed).toHaveBeenCalledWith(
      resizeControlProps.createAnalyticsEvent,
      {
        trigger: 'chevron',
        isCollapsed: true,
      },
    );
  });
});

describe('ResizeControl', () => {});
