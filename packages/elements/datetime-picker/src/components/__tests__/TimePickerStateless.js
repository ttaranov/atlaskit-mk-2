// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { name } from '../../../package.json';
import TimePickerStateless from '../TimePickerStateless';
import Picker from '../internal/Picker';
import TimeDialog from '../internal/TimeDialog';
import TimeField from '../internal/TimeField';

describe(name, () => {
  describe('TimePickerStateless', () => {
    it('renders a Picker with a TimeDialog and TimeField', () => {
      const wrapper = shallow(<TimePickerStateless />);

      expect(wrapper.find(Picker)).toHaveLength(1);
      const pickerProps = wrapper.find(Picker).props();
      expect(pickerProps.dialog).toBe(TimeDialog);
      expect(pickerProps.field).toBe(TimeField);
    });

    it('passes the focused and times properties to the dialog', () => {
      const focused = 'test-focused-value';
      const times = ['1', '2', '3'];
      const wrapper = shallow(<TimePickerStateless focused={focused} times={times} />);

      const pickerDialogProps = wrapper.find(Picker).props().dialogProps;
      expect(pickerDialogProps.value).toBe(focused);
      expect(pickerDialogProps.times).toBe(times);
    });
  });
});
