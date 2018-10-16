// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import ContentNavigation from '../../../ContentNavigation';
import LayoutManager from '../../LayoutManager';
import { ContainerNavigationMask, NavigationContainer } from '../../primitives';
import type { LayoutManagerProps } from '../../types';

const GlobalNavigation = () => null;
const ProductNavigation = () => null;

describe('LayoutManager', () => {
  let defaultProps: $Shape<LayoutManagerProps>;
  let mockNavigationUIController: any;
  beforeEach(() => {
    mockNavigationUIController = ({
      expand: Function.prototype,
      state: {
        isCollapsed: false,
      },
    }: any);
    defaultProps = {
      navigationUIController: mockNavigationUIController,
      globalNavigation: GlobalNavigation,
      productNavigation: ProductNavigation,
      containerNavigation: null,
      children: <div>Page content</div>,
    };
  });
  // TODO: Please update this test, it should be deterministic,
  // make sure your generated snapshots do not include platform specific or other non-deterministic data. In this case, the packageVersion.
  // eslint-disable-next-line
  it.skip('should render correctly', () => {
    const wrapper = shallow(<LayoutManager {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('Flyout', () => {
    beforeEach(() => {
      defaultProps.experimental_flyoutOnHover = true;
      defaultProps.navigationUIController.state.isCollapsed = true;
    });

    describe('when experimental_flyoutOnHover is set and navigation is collapsed', () => {
      let handlers = {};
      let wrapper;

      beforeEach(() => {
        jest.useFakeTimers();
        handlers = {
          onExpandStart: jest.fn(),
          onExpandEnd: jest.fn(),
          onCollapseStart: jest.fn(),
          onCollapseEnd: jest.fn(),
        };
        wrapper = mount(<LayoutManager {...handlers} {...defaultProps} />);
      });

      it('should open when mousing over ContainerNavigationMask with a delay of 350ms', () => {
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');

        jest.advanceTimersByTime(349);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);

        jest.advanceTimersByTime(1);
        expect(wrapper.state('flyoutIsOpen')).toBe(true);
        expect(handlers.onExpandStart).toHaveBeenCalledWith(
          expect.anything(),
          false,
          true,
        );

        jest.advanceTimersByTime(300);
        expect(handlers.onExpandEnd).toHaveBeenCalledWith(
          expect.anything(),
          false,
          true,
        );
        expect(handlers.onCollapseStart).not.toHaveBeenCalled();
        expect(handlers.onCollapseEnd).not.toHaveBeenCalled();
      });

      it('should not open when mousing out before 350ms', () => {
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');

        jest.advanceTimersByTime(300);
        wrapper.find(NavigationContainer).simulate('mouseleave');

        jest.runAllTimers();
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        expect(handlers.onExpandStart).not.toHaveBeenCalled();
        expect(handlers.onExpandEnd).not.toHaveBeenCalled();
        expect(handlers.onCollapseStart).not.toHaveBeenCalled();
        expect(handlers.onCollapseEnd).not.toHaveBeenCalled();
      });

      it('should close when mousing out of NavigationContainer', () => {
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        jest.advanceTimersByTime(350);

        expect(wrapper.state('flyoutIsOpen')).toBe(true);
        expect(handlers.onExpandStart).toHaveBeenCalledWith(
          expect.anything(),
          false,
          true,
        );

        jest.advanceTimersByTime(300);
        expect(handlers.onExpandEnd).toHaveBeenCalledWith(
          expect.anything(),
          false,
          true,
        );

        wrapper.find(NavigationContainer).simulate('mouseout');

        jest.advanceTimersByTime(300);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        expect(handlers.onCollapseStart).toHaveBeenCalledWith(
          expect.anything(),
          undefined,
          true,
        );
        expect(handlers.onCollapseEnd).toHaveBeenCalledWith(
          expect.anything(),
          undefined,
          true,
        );
      });

      it('should display ContentNavigation when flyout is open', () => {
        wrapper.setState({ flyoutIsOpen: true });
        wrapper.update();
        expect(wrapper.find(ContentNavigation).prop('isVisible')).toBe(true);
      });

      it('should NOT display ContentNavigation flyout is closed', () => {
        wrapper.setState({ flyoutIsOpen: false });
        wrapper.update();
        expect(wrapper.find(ContentNavigation).prop('isVisible')).toBe(false);
      });

      it('should NOT display resize hint bar', () => {
        const resizeBar = wrapper.find(
          'div[aria-label="Click to expand the navigation"]',
        );
        expect(resizeBar).toHaveLength(0);
      });

      it('should NOT be open when nav is permanently expanded', () => {
        defaultProps.navigationUIController.state.isCollapsed = false;
        wrapper.setProps(defaultProps);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);

        wrapper.find(ContainerNavigationMask).simulate('mouseover');

        jest.advanceTimersByTime(300);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        expect(handlers.onExpandStart).toHaveBeenCalledWith(
          expect.anything(),
          false,
          false,
        );
        expect(handlers.onExpandEnd).toHaveBeenCalledWith(
          expect.anything(),
          false,
          false,
        );
        expect(handlers.onCollapseStart).not.toHaveBeenCalled();
        expect(handlers.onCollapseEnd).not.toHaveBeenCalled();
      });

      it('should NOT listen to mouseOvers over ContainerNavigationMask if flyout is already open', () => {
        expect(
          wrapper.find(ContainerNavigationMask).prop('onMouseOver'),
        ).toEqual(expect.any(Function));
        wrapper.find(ContainerNavigationMask).simulate('mouseover');

        jest.advanceTimersByTime(349);
        wrapper.update();
        expect(
          wrapper.find(ContainerNavigationMask).prop('onMouseOver'),
        ).toEqual(expect.any(Function));

        jest.advanceTimersByTime(1);
        wrapper.update();
        expect(
          wrapper.find(ContainerNavigationMask).prop('onMouseOver'),
        ).toBeNull();
      });

      it('should NOT listen to mouseOuts of NavigationContainer if flyout is already closed', () => {
        wrapper.setState({ flyoutIsOpen: false });
        wrapper.update();
        expect(wrapper.find(NavigationContainer).prop('onMouseOut')).toBeNull();
      });
    });

    describe('when experimental_flyoutOnHover is not set', () => {
      let handlers = {};
      let wrapper;

      beforeEach(() => {
        jest.useFakeTimers();
        handlers = {
          onExpandStart: jest.fn(),
          onExpandEnd: jest.fn(),
          onCollapseStart: jest.fn(),
          onCollapseEnd: jest.fn(),
        };
        defaultProps.experimental_flyoutOnHover = false;
        wrapper = mount(<LayoutManager {...handlers} {...defaultProps} />);
      });

      it('should NOT open NavigationContainer when mousing over ContainerNavigationMask', () => {
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');

        jest.advanceTimersByTime(300);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        expect(handlers.onExpandStart).not.toHaveBeenCalled();
        expect(handlers.onExpandEnd).not.toHaveBeenCalled();
        expect(handlers.onCollapseStart).not.toHaveBeenCalled();
        expect(handlers.onCollapseEnd).not.toHaveBeenCalled();
      });

      it('should NOT cause a re-render when mousing out of NavigationContainer', () => {
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(NavigationContainer).simulate('mouseover');

        jest.advanceTimersByTime(300);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);

        wrapper.find(NavigationContainer).simulate('mouseout');

        jest.advanceTimersByTime(300);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        expect(handlers.onExpandStart).not.toHaveBeenCalled();
        expect(handlers.onExpandEnd).not.toHaveBeenCalled();
        expect(handlers.onCollapseStart).not.toHaveBeenCalled();
        expect(handlers.onCollapseEnd).not.toHaveBeenCalled();
      });
    });

    describe('when navigation is permanently expanded', () => {
      let handlers = {};
      let wrapper;

      beforeEach(() => {
        jest.useFakeTimers();
        handlers = {
          onExpandStart: jest.fn(),
          onExpandEnd: jest.fn(),
          onCollapseStart: jest.fn(),
          onCollapseEnd: jest.fn(),
        };
        defaultProps.navigationUIController.state.isCollapsed = false;
        wrapper = mount(<LayoutManager {...handlers} {...defaultProps} />);
      });

      it('should NOT cause a re-render when mousing over ContainerNavigationMask', () => {
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');

        jest.advanceTimersByTime(300);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        expect(handlers.onExpandStart).not.toHaveBeenCalled();
        expect(handlers.onExpandEnd).not.toHaveBeenCalled();
        expect(handlers.onCollapseStart).not.toHaveBeenCalled();
        expect(handlers.onCollapseEnd).not.toHaveBeenCalled();
      });

      it('should NOT cause a re-render when mousing out of NavigationContainer', () => {
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(NavigationContainer).simulate('mouseover');

        jest.advanceTimersByTime(300);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);

        wrapper.find(NavigationContainer).simulate('mouseout');

        jest.advanceTimersByTime(300);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        expect(handlers.onExpandStart).not.toHaveBeenCalled();
        expect(handlers.onExpandEnd).not.toHaveBeenCalled();
        expect(handlers.onCollapseStart).not.toHaveBeenCalled();
        expect(handlers.onCollapseEnd).not.toHaveBeenCalled();
      });
    });
  });

  describe('analytics', () => {
    it('should render NavigationAnalyticsContext with correct payload when nav is collapsed', () => {
      defaultProps.navigationUIController.state.isCollapsed = true;
      const wrapper = shallow(<LayoutManager {...defaultProps} />);

      const analyticsContext = wrapper.find(NavigationAnalyticsContext);

      expect(analyticsContext).toHaveLength(1);
      expect(analyticsContext.prop('data')).toEqual({
        attributes: {
          isExpanded: false,
          flyoutOnHoverEnabled: false,
        },
        componentName: 'navigation',
        packageName: '@atlaskit/navigation-next',
        packageVersion: expect.any(String),
      });
    });

    it('should render NavigationAnalyticsContext with correct payload when nav is expanded', () => {
      defaultProps.navigationUIController.state.isCollapsed = false;
      const wrapper = shallow(<LayoutManager {...defaultProps} />);

      const analyticsContext = wrapper.find(NavigationAnalyticsContext);

      expect(analyticsContext).toHaveLength(1);
      expect(analyticsContext.prop('data')).toEqual({
        attributes: {
          isExpanded: true,
          flyoutOnHoverEnabled: false,
        },
        componentName: 'navigation',
        packageName: '@atlaskit/navigation-next',
        packageVersion: expect.any(String),
      });
    });

    it('should render NavigationAnalyticsContext with correct payload when flyoutOnHover experiment is enabled', () => {
      defaultProps.experimental_flyoutOnHover = true;
      const wrapper = shallow(<LayoutManager {...defaultProps} />);

      const analyticsContext = wrapper.find(NavigationAnalyticsContext);

      expect(analyticsContext).toHaveLength(1);
      expect(analyticsContext.prop('data')).toEqual({
        attributes: {
          isExpanded: true,
          flyoutOnHoverEnabled: true,
        },
        componentName: 'navigation',
        packageName: '@atlaskit/navigation-next',
        packageVersion: expect.any(String),
      });
    });
  });
});
