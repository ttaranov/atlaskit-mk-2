// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import LayoutManager from '../../LayoutManager';
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
  it('should render correctly', () => {
    const wrapper = shallow(<LayoutManager {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
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
