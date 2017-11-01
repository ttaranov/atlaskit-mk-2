// @flow

import React from 'react';
import { shallow } from 'enzyme';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import { name } from '../../../../package.json';
import Picker from '../Picker';
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

    it('calls onFieldBlur when the field is blurred', () => {
      const onFieldBlurMock = jest.fn();
      const wrapper = shallow(<Picker {...components} onFieldBlur={onFieldBlurMock} />);

      wrapper.find(PickerTestComponent).at(1).props().onBlur();

      expect(onFieldBlurMock.mock.calls).toHaveLength(1);
    });

    it('calls onFieldChange when the field is changed', () => {
      const onFieldChangeMock = jest.fn();
      const wrapper = shallow(<Picker {...components} onFieldChange={onFieldChangeMock} />);

      wrapper.find(PickerTestComponent).at(1).props().onChange();

      expect(onFieldChangeMock.mock.calls).toHaveLength(1);
    });

    it('calls onFieldTriggerOpen when the field triggers a dialog open', () => {
      const onFieldTriggerOpenMock = jest.fn();
      const wrapper = shallow(<Picker {...components} onFieldTriggerOpen={onFieldTriggerOpenMock} />);

      wrapper.find(PickerTestComponent).at(1).props().onTriggerOpen();

      expect(onFieldTriggerOpenMock.mock.calls).toHaveLength(1);
    });

    it('calls onPickerBlur when the picker is blurred', () => {
      const onPickerBlurMock = jest.fn();
      const wrapper = shallow(<Picker {...components} onPickerBlur={onPickerBlurMock} />);

      wrapper.find(PickerTestComponent).at(0).props().onBlur();

      expect(onPickerBlurMock.mock.calls).toHaveLength(1);
    });

    it('calls onPickerTriggerClose when the picker triggers a dialog close', () => {
      const onPickerTriggerCloseMock = jest.fn();
      const wrapper = shallow(<Picker {...components} onPickerTriggerClose={onPickerTriggerCloseMock} />);

      wrapper.find(PickerTestComponent).at(0).props().onTriggerClose();

      expect(onPickerTriggerCloseMock.mock.calls).toHaveLength(1);
    });

    it('calls onPickerUpdate when the picker is updated', () => {
      const onPickerUpdateMock = jest.fn();
      const wrapper = shallow(<Picker {...components} onPickerUpdate={onPickerUpdateMock} />);

      wrapper.find(PickerTestComponent).at(0).props().onUpdate();

      expect(onPickerUpdateMock.mock.calls).toHaveLength(1);
    });
  });
});
