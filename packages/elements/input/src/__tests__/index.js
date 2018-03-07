// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';

import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  name,
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import SingleLineTextInputWithAnalytics, {
  SingleLineTextInput,
} from '../SingleLineTextInput';

describe(name, () => {
  it('selects the input when select() is called', () => {
    const value = 'my-value';
    const wrapper = mount(
      <SingleLineTextInput isEditing onChange={() => {}} value={value} />,
    );

    wrapper.instance().select();

    const input = wrapper.find('input').instance();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(value.length);
  });
});
describe('analytics - Input', () => {});
describe('analytics - SingleLineTextInput', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<SingleLineTextInputWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'input',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onConfirm handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<SingleLineTextInputWithAnalytics onConfirm={spy} />);
    wrapper.find('button').simulate('confirm');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'confirm',
      }),
    );
  });

  it('should pass analytics event as last argument to onKeyDown handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<SingleLineTextInputWithAnalytics onKeyDown={spy} />);
    wrapper.find('button').simulate('keydown');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'keydown',
      }),
    );
  });

  it('should fire an atlaskit analytics event on confirm', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <SingleLineTextInputWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(SingleLineTextInputWithAnalytics).simulate('confirm');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'confirm' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'input',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on keydown', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <SingleLineTextInputWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(SingleLineTextInputWithAnalytics).simulate('keydown');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'keydown' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'input',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
