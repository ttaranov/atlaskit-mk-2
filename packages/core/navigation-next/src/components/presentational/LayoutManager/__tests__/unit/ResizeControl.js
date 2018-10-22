// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';
import cloneDeep from 'lodash.clonedeep';
import ChevronLeft from '@atlaskit/icon/glyph/chevron-left';
import { ResizeControlBase } from '../../ResizeControl';
import { navigationExpandedCollapsed } from '../../../../../common/analytics';

jest.mock('../../../../../common/analytics', () => ({
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

describe('ResizeControl', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
  it('should wrap ResizeControlBase with withAnalyticsEvents HOC', () => {
    const WrappedComp = () => null;
    const mockReturn = jest.fn(() => WrappedComp);
    const mockWithAnalyticsEvents = jest.fn(() => mockReturn);
    jest.doMock('@atlaskit/analytics-next', () => ({
      createAndFireEvent: jest.fn(() => jest.fn()),
      withAnalyticsEvents: mockWithAnalyticsEvents,
      withAnalyticsContext: jest.fn(() => () => null),
    }));

    expect(mockWithAnalyticsEvents).toHaveBeenCalledTimes(0);
    const {
      default: ResizeControl,
      ResizeControlBase: RequiredResizeControlBase,
    } = require('../../ResizeControl');

    // withAnalyticsEvent map should not be called with anything
    expect(mockWithAnalyticsEvents).toHaveBeenLastCalledWith();
    // The return of the call above should be called with ResizeControlBase
    expect(mockReturn).toHaveBeenLastCalledWith(RequiredResizeControlBase);
    // The return of the call above should be the default export
    expect(ResizeControl).toBe(WrappedComp);
  });
});
