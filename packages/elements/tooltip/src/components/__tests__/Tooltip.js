// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';

import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
import TooltipWithAnalytics, { Tooltip } from '../Tooltip';

describe('Tooltip', () => {
  it('should be possible to create a component', () => {
    const wrapper = shallow(<Tooltip />);
    expect(wrapper).not.toBe(undefined);
  });
});
describe('analytics - Tooltip', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<TooltipWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'tooltip',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onMouseOver handler', () => {});

  it('should pass analytics event as last argument to onMouseOut handler', () => {});

  it('should fire an atlaskit analytics event on mouseover', () => {});

  it('should fire an atlaskit analytics event on mouseout', () => {});
});
