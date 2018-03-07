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
import TimePickerWithAnalytics, { TimePicker } from '../TimePicker';
import TimePickerStateless from '../TimePickerStateless';

describe(name, () => {
  describe('TimePicker', () => {
    it('renders a TimePickerStateless', () => {
      const wrapper = shallow(<TimePicker />);
      expect(wrapper.find(TimePickerStateless)).toHaveLength(1);
    });

    it('calls onChange when the input is blurred and the content is valid', () => {
      const testValue = '13:00';
      const onChangeMock = jest.fn();
      const wrapper = mount(<TimePicker onChange={onChangeMock} />);

      wrapper.setState({ value: testValue });
      wrapper.find('input').simulate('blur');

      expect(onChangeMock.mock.calls).toHaveLength(1);
      expect(onChangeMock.mock.calls[0][0]).toBe(testValue);
    });

    it('does not call onChange when the input is blurred and the content is invalid', () => {
      const onChangeMock = jest.fn();
      const wrapper = mount(<TimePicker onChange={onChangeMock} />);

      wrapper.setState({ value: 'invalid value' });
      wrapper.find('input').simulate('blur');

      expect(onChangeMock.mock.calls).toHaveLength(0);
    });

    it('updates the display value when the input value is changed', () => {
      const testValue = 'new value';
      const wrapper = mount(<TimePicker />);

      wrapper
        .find('input')
        .simulate('change', { target: { value: testValue } });
      wrapper.update();

      expect(wrapper.state().value).toBe(testValue);
    });

    it('opens the dialog when triggered by the field', () => {
      const wrapper = shallow(<TimePicker />);
      wrapper
        .find(TimePickerStateless)
        .props()
        .onFieldKeyDown({ key: 'ArrowDown' });
      wrapper.update();
      expect(wrapper.find(TimePickerStateless).props().isOpen).toBe(true);
    });

    it('closes the dialog when triggered by the dialog', () => {
      const wrapper = shallow(<TimePicker />);

      wrapper.setState({ isOpen: true });
      wrapper
        .find(TimePickerStateless)
        .props()
        .onFieldKeyDown({ key: 'Escape' });
      wrapper.update();
      expect(wrapper.find(TimePickerStateless).props().isOpen).toBe(false);
    });

    it('closes the dialog when the input loses focus', () => {
      const wrapper = mount(<TimePicker />);

      wrapper.setState({ isOpen: true });
      wrapper.find('input').simulate('blur');

      expect(wrapper.find(TimePickerStateless).props().isOpen).toBe(false);
    });

    it('calls onChange when a time is selected from the dropdown, closes the dropdown, and updates the values', () => {
      const testValue = '12:30pm';
      const onChangeMock = jest.fn();
      const wrapper = shallow(<TimePicker onChange={onChangeMock} />);

      wrapper.setState({ isOpen: true });
      wrapper.props().onPickerUpdate(testValue);
      wrapper.update();

      expect(onChangeMock.mock.calls).toHaveLength(1);
      expect(onChangeMock.mock.calls[0][0]).toBe(testValue);
      expect(wrapper.state()).toMatchObject({
        isOpen: false,
        value: testValue,
      });
    });
  });
});
describe('analytics - TimePicker', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<TimePickerWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'time-picker',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<TimePickerWithAnalytics onChange={spy} />);
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
        <TimePickerWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(TimePickerWithAnalytics).simulate('change');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'change' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'time-picker',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
