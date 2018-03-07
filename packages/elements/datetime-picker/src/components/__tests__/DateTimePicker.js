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

  it('should pass analytics event as last argument to onChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<DateTimePickerWithAnalytics onChange={spy} />);
    wrapper.find('button').simulate('change');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'change',
      }),
    );
  });

  it('should fire an atlaskit analytics event on change', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <DateTimePickerWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(DateTimePickerWithAnalytics).simulate('change');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'change' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'date-picker',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
