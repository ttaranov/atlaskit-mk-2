// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  name,
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
import DateTimePickerWithAnalytics, { DateTimePicker } from '../DateTimePicker';
import DateTimePickerStateless from '../DateTimePickerStateless';

describe(name, () => {
  describe('DateTimePickerStateless', () => {
    it('renders a DateTimePickerStateless', () => {
      const wrapper = shallow(<DateTimePicker />);

      expect(wrapper.find(DateTimePickerStateless)).toHaveLength(1);
    });
  });
});
describe('analytics - DateTimePicker', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<DateTimePickerWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'date-picker',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onChange handler', () => {});

  it('should fire an atlaskit analytics event on change', () => {});
});
