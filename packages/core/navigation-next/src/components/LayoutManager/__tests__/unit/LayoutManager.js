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
      beforeEach(() => {
        jest.useFakeTimers();
      });
      it('should open when mousing over ContainerNavigationMask', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        expect(wrapper.state('flyoutIsOpen')).toBe(true);
      });

      it('should close when mousing out of NavigationContainer', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        wrapper.find(NavigationContainer).simulate('mouseout');
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });

      it('should display ContentNavigation when flyout is open', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.setState({ flyoutIsOpen: true });
        wrapper.update();
        expect(wrapper.find(ContentNavigation).prop('isVisible')).toBe(true);
      });

      it('should NOT display ContentNavigation flyout is closed', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.setState({ flyoutIsOpen: false });
        wrapper.update();
        expect(wrapper.find(ContentNavigation).prop('isVisible')).toBe(false);
      });

      it('should NOT display resize hint bar', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        const resizeBar = wrapper.find(
          'div[aria-label="Click to expand the navigation"]',
        );
        expect(resizeBar).toHaveLength(0);
      });

      it('should NOT be open when nav is permanently expanded', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        defaultProps.navigationUIController.state.isCollapsed = false;
        wrapper.setProps(defaultProps);

        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });

      it('should NOT listen to mouseOvers over ContainerNavigationMask if flyout is already open', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(
          wrapper.find(ContainerNavigationMask).prop('onMouseOver'),
        ).toEqual(expect.any(Function));
        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        expect(
          wrapper.find(ContainerNavigationMask).prop('onMouseOver'),
        ).toBeNull();
      });

      it('should have transitionDelay style when the flyout is open', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.setState({ flyoutIsOpen: true });
        wrapper.update();
        expect(
          wrapper.find('ContentNavigationWrapper').prop('style'),
        ).toHaveProperty('transitionDelay', '350ms');
      });

      it('should NOT have transitionDelay style when the flyout is closed', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.setState({ flyoutIsOpen: false });
        wrapper.update();
        expect(
          wrapper.find('ContentNavigationWrapper').prop('style'),
        ).not.toHaveProperty('transitionDelay', '350ms');
      });

      it('should show ChevronRight when flyout is open', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.setState({ flyoutIsOpen: true });
        jest.runAllTimers();
        wrapper.update();
        expect(wrapper.find('ChevronRightIcon').exists()).toBeTruthy();
        expect(wrapper.find('MenuIcon').exists()).toBeFalsy();
      });
      it('should show the menu icon when flyout is closed', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.setState({ flyoutIsOpen: false });
        wrapper.update();
        expect(wrapper.find('MenuIcon').exists()).toBeTruthy();
        expect(wrapper.find('ChevronRightIcon').exists()).toBeFalsy();
      });

      it('should NOT listen to mouseOuts of NavigationContainer if flyout is already closed', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);

        wrapper.setState({ flyoutIsOpen: false });
        wrapper.update();
        expect(wrapper.find(NavigationContainer).prop('onMouseOut')).toBeNull();
      });
    });

    describe('when experimental_flyoutOnHover is not set', () => {
      beforeEach(() => {
        defaultProps.experimental_flyoutOnHover = false;
      });

      it('should NOT open NavigationContainer when mousing over ContainerNavigationMask', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });

      it('should NOT cause a re-render when mousing out of NavigationContainer', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(NavigationContainer).simulate('mouseover');
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });
    });

    describe('when navigation is permanently expanded', () => {
      beforeEach(() => {
        defaultProps.navigationUIController.state.isCollapsed = false;
      });

      it('should NOT cause a re-render when mousing over ContainerNavigationMask', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(ContainerNavigationMask).simulate('mouseover');
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
      });

      it('should NOT cause a re-render when mousing out of NavigationContainer', () => {
        const wrapper = mount(<LayoutManager {...defaultProps} />);
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
        wrapper.find(NavigationContainer).simulate('mouseover');
        expect(wrapper.state('flyoutIsOpen')).toBe(false);
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
