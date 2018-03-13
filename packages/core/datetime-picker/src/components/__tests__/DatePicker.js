// @flow

import React from 'react';
import { shallow, mount } from 'enzyme';
import { name } from '../../../package.json';
import DatePickerWithAnalytics, { DatePicker } from '../DatePicker';
import DatePickerStateless from '../DatePickerStateless';

describe(name, () => {
  describe('DatePicker', () => {
    it('renders a DatePickerStateless', () => {
      const wrapper = shallow(<DatePicker />);
      expect(wrapper.find(DatePickerStateless)).toHaveLength(1);
    });

    it('calls onChange when the input is blurred and the content is valid', () => {
      const testValue = '2014-12-05';
      const onChangeMock = jest.fn();
      const wrapper = mount(<DatePicker onChange={onChangeMock} />);

      wrapper.setState({ value: testValue });
      wrapper.find('input').simulate('blur');

      expect(onChangeMock.mock.calls).toHaveLength(1);
      expect(onChangeMock.mock.calls[0][0]).toBe(testValue);
    });

    it('does not call onChange when the input is blurred and the content is invalid', () => {
      const onChangeMock = jest.fn();
      const wrapper = mount(<DatePicker onChange={onChangeMock} />);

      wrapper.setState({ value: 'invalid value' });
      wrapper.find('input').simulate('blur');

      expect(onChangeMock.mock.calls).toHaveLength(0);
    });

    it('updates the displayValue when the input value is changed', () => {
      const testValue = 'new value';
      const wrapper = mount(<DatePicker />);

      wrapper
        .find('input')
        .simulate('change', { target: { value: testValue } });

      expect(wrapper.find(DatePickerStateless).props().displayValue).toBe(
        testValue,
      );
    });

    it('opens the dialog when triggered by the field', () => {
      const wrapper = shallow(<DatePicker />);
      wrapper
        .find(DatePickerStateless)
        .props()
        .onFieldTriggerOpen();
      wrapper.update();
      expect(wrapper.find(DatePickerStateless).props().isOpen).toBe(true);
    });

    it('closes the dialog when triggered by the dialog', () => {
      const wrapper = shallow(<DatePicker />);
      wrapper.setState({ isOpen: true });
      wrapper
        .find(DatePickerStateless)
        .props()
        .onPickerTriggerClose();
      expect(wrapper.state().isOpen).toBe(false);
    });

    it('closes the dialog when the icon is clicked and the dialog is open', () => {
      const wrapper = shallow(<DatePicker />);
      wrapper.setState({ isOpen: true });
      wrapper
        .find(DatePickerStateless)
        .props()
        .onIconClick();
      wrapper.update();
      expect(wrapper.find(DatePickerStateless).props().isOpen).toBe(false);
    });

    it('opens the dialog when the icon is clicked and the dialog is closed', () => {
      const wrapper = shallow(<DatePicker />);
      wrapper
        .find(DatePickerStateless)
        .props()
        .onIconClick();
      wrapper.update();
      expect(wrapper.find(DatePickerStateless).props().isOpen).toBe(true);
    });

    it('closes the dialog when it loses focus', () => {
      const wrapper = shallow(<DatePicker />);
      wrapper.setState({ isOpen: true });
      wrapper
        .find(DatePickerStateless)
        .props()
        .onPickerBlur();
      wrapper.update();
      expect(wrapper.find(DatePickerStateless).props().isOpen).toBe(false);
    });

    it('calls onChange when a calendar date is selected, closes the dialog, and updates the values', () => {
      const testValue = '2014-12-05';
      const formattedValue = '2014/12/05';
      const onChangeMock = jest.fn();
      const wrapper = shallow(<DatePicker onChange={onChangeMock} />);

      wrapper.setState({ isOpen: true });
      wrapper
        .find(DatePickerStateless)
        .props()
        .onPickerUpdate(testValue);
      wrapper.update();

      expect(onChangeMock.mock.calls).toHaveLength(1);
      expect(onChangeMock.mock.calls[0][0]).toBe(testValue);

      const datePickerStatelessProps = wrapper
        .find(DatePickerStateless)
        .props();
      expect(datePickerStatelessProps.isOpen).toBe(false);
      expect(datePickerStatelessProps.value).toBe(testValue);
      expect(datePickerStatelessProps.displayValue).toBe(formattedValue);
    });
  });
});
describe('DatePickerWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<DatePickerWithAnalytics />);
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
});
