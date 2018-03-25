// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';
import { name } from '../../../package.json';
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
describe('TimePickerWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<TimePickerWithAnalytics />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
