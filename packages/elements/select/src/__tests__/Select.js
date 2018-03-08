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
} from '../../package.json';
import SelectWithAnalytics, { Select } from '../Select';

describe('Select', () => {
  it('should be possible to create a component', () => {
    const wrapper = shallow(<Select />);
    expect(wrapper).not.toBe(undefined);
  });
});
describe('analytics - Select', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<SelectWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'select',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onChange handler', () => {});

  it('should pass analytics event as last argument to onKeyDown handler', () => {});

  it('should fire an atlaskit analytics event on change', () => {});

  it('should fire an atlaskit analytics event on keydown', () => {});
});
