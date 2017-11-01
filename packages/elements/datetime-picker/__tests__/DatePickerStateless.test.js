// @flow

import React from 'react';
import { mount } from 'enzyme';
import { name } from '../package.json';
import DatePickerStateless from '../src/components//DatePicker';
import Picker from '../src/components/internal/Picker';
import DateField from '../src/components/internal/DateField';
import DateDialog from '../src/components/internal/DateDialog';

describe(name, () => {
  describe('DatePickerStateless', () => {
    it('renders a Picker with a DateDialog, DateField and correct props', () => {
      const wrapper = mount(<DatePickerStateless />);

      expect(wrapper.find(Picker)).toHaveLength(1);
      const pickerProps = wrapper.find(Picker).props();
      expect(pickerProps.field).toBe(DateField);
      expect(pickerProps.dialog).toBe(DateDialog);
    });
  });
});
