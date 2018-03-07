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

  it('should pass analytics event as last argument to onMouseOver handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<TooltipWithAnalytics onMouseOver={spy} />);
    wrapper.find('button').simulate('mouseover');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'mouseover',
      }),
    );
  });

  it('should pass analytics event as last argument to onMouseOut handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<TooltipWithAnalytics onMouseOut={spy} />);
    wrapper.find('button').simulate('mouseout');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'mouseout',
      }),
    );
  });

  it('should fire an atlaskit analytics event on mouseover', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <TooltipWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(TooltipWithAnalytics).simulate('mouseover');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'mouseover' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'tooltip',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on mouseout', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <TooltipWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(TooltipWithAnalytics).simulate('mouseout');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'mouseout' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'tooltip',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
