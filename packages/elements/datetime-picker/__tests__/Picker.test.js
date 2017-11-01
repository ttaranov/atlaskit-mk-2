// @flow

import React from 'react';
import { shallow } from 'enzyme';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { name } from '../package.json';
import Picker from '../src/components/internal/Picker';
import PickerTestComponent from '../__test-helpers/PickerTestComponent';

describe(name, () => {
  describe('Picker', () => {
    const components = {
      dialog: PickerTestComponent,
      field: PickerTestComponent,
    };

    it('renders a dialog and field with the correct properties', () => {
      const props = {
        ...components,
        value: 'test-value',
        displayValue: 'test-display-value',
        isOpen: true,
        isDisabled: true,
        shouldShowIcon: true,
        onIconClick() {},
        onPickerBlur() {},
        onPickerTriggerClose() {},
        onPickerUpdate() {},
        onFieldBlur() {},
        onFieldChange() {},
        onFieldTriggerOpen() {},
      };

      const wrapper = shallow(<Picker {...props} />);
      expect(wrapper.find(PickerTestComponent)).toHaveLength(2);

      expect(wrapper.find({
        value: props.value,
        isOpen: props.isOpen,
        onBlur: props.onPickerBlur,
        onTriggerClose: props.onPickerTriggerClose,
        onUpdate: props.onPickerUpdate,
      })).toHaveLength(1);

      expect(wrapper.find({
        value: props.displayValue,
        onBlur: props.onFieldBlur,
        onChange: props.onFieldChange,
        onTriggerOpen: props.onFieldTriggerOpen,
      })).toHaveLength(1);
    });

    it('renders the icon if shouldShowIcon is true', () => {
      const wrapper = shallow(<Picker {...components} shouldShowIcon />);
      expect(wrapper.find(CalendarIcon)).toHaveLength(1);
    });

    it('does not render the icon if shouldShowIcon is false', () => {
      const wrapper = shallow(<Picker {...components} shouldShowIcon={false} />);
      expect(wrapper.find(CalendarIcon)).toHaveLength(0);
    });

    it('calls onIconClick on icon MouseDown event', () => {
      const onIconClickMock = jest.fn();
      const wrapper = shallow(<Picker
        {...components}
        shouldShowIcon
        onIconClick={onIconClickMock}
      />);

      wrapper.find(CalendarIcon).parent().simulate('mouseDown', { preventDefault() {} });

      expect(onIconClickMock.mock.calls.length).toBe(1);
    });

    it('does not call onIconClick on icon Mousedown event when isDisabled is true', () => {
      const onIconClickMock = jest.fn();
      const wrapper = shallow(<Picker
        {...components}
        isDisabled
        shouldShowIcon
        onIconClick={onIconClickMock}
      />);

      wrapper.find(CalendarIcon).parent().simulate('mouseDown', { preventDefault() {} });

      expect(onIconClickMock.mock.calls.length).toBe(0);
    });
  });
});
