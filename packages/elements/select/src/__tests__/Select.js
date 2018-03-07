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

  it('should pass analytics event as last argument to onChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<SelectWithAnalytics onChange={spy} />);
    wrapper.find('button').simulate('change');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'change',
      }),
    );
  });

  it('should pass analytics event as last argument to onKeyDown handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<SelectWithAnalytics onKeyDown={spy} />);
    wrapper.find('button').simulate('keydown');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'keydown',
      }),
    );
  });

  it('should fire an atlaskit analytics event on change', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <SelectWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(SelectWithAnalytics).simulate('change');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'change' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'select',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on keydown', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <SelectWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(SelectWithAnalytics).simulate('keydown');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'keydown' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'select',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
