// @flow

import React from 'react';
import { shallow } from 'enzyme';
import { name } from '../../../package.json';
import DateTimePicker from '../DateTimePicker';
import DateTimePickerStateless from '../DateTimePickerStateless';

describe(name, () => {
  describe('DateTimePickerStateless', () => {
    it('renders a DateTimePickerStateless', () => {
      const wrapper = shallow(<DateTimePicker />);

      expect(wrapper.find(DateTimePickerStateless)).toHaveLength(1);
    });
  });
});
