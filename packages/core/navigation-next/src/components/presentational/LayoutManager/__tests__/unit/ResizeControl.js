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

  describe('When the component is resizing', () => {
    it('should not change width and delta when mouseIsDown is falsy', () => {
      const props = cloneDeep(resizeControlProps);
      const wrapper = mount(
        <ResizeControlBase {...props}>{() => null}</ResizeControlBase>,
      );
      wrapper.setState({ mouseIsDown: false, isDragging: true });
      const { width: cachedWidth, delta: cachedDelta } = wrapper.state();

      wrapper.instance().handleResize({ pageX: 100 });
      requestAnimationFrame.step();

      expect(wrapper.state('width')).toEqual(cachedWidth);
      expect(wrapper.state('delta')).toEqual(cachedDelta);
    });

    it('should change width and delta when isDragging is falsy', () => {
      const props = cloneDeep(resizeControlProps);
      const wrapper = mount(
        <ResizeControlBase {...props}>{() => null}</ResizeControlBase>,
      );
      wrapper.setState({ mouseIsDown: true, isDragging: false });
      const { width: cachedWidth, delta: cachedDelta } = wrapper.state();

      wrapper.instance().handleResize({ pageX: 100 });
      requestAnimationFrame.step();

      expect(wrapper.state('width')).toEqual(cachedWidth);
      expect(wrapper.state('delta')).toEqual(cachedDelta);
    });

    describe('When mouseIsdDown and isDragging are truthy', () => {
      it('should change mutationRef style if new value is different than old value', () => {
        const pageX = 100;
        const mutationRefs = [
          {
            property: 'padding-left',
            ref: {
              style: {
                getPropertyValue: jest.fn().mockReturnValue('562px'),
                setProperty: jest.fn(),
              },
            },
          },
          //not supposed to call setProperty for the ref below
          {
            property: 'width',
            ref: {
              style: {
                getPropertyValue: jest.fn().mockReturnValue(`${pageX}px`),
                setProperty: jest.fn(),
              },
            },
          },
        ];
        const props = { ...cloneDeep(resizeControlProps), mutationRefs };
        const wrapper = mount(
          <ResizeControlBase {...props}>{() => null}</ResizeControlBase>,
        );
        wrapper.setState({ mouseIsDown: true, isDragging: true });

        wrapper.instance().handleResize({ pageX });
        requestAnimationFrame.step();

        expect(
          mutationRefs[0].ref.style.getPropertyValue,
        ).toHaveBeenCalledTimes(1);
        expect(mutationRefs[0].ref.style.setProperty).toHaveBeenCalledWith(
          'padding-left',
          '100px',
        );
        expect(
          mutationRefs[1].ref.style.getPropertyValue,
        ).toHaveBeenCalledTimes(1);
        expect(mutationRefs[1].ref.style.setProperty).not.toHaveBeenCalled();
      });
    });
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
