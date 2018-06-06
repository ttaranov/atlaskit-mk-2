// @flow

import React from 'react';
import { shallow } from 'enzyme';
import Select from '@atlaskit/select';
import TimePicker from '../../TimePicker';

test('default', () => {
  expect(
    shallow(<TimePicker value="08:00:00" />)
      .find(Select)
      .props().value,
  ).toEqual({ label: '8:00am', value: '08:00:00' });
});

test('custom', () => {
  expect(
    shallow(<TimePicker value="08:00:00" timeFormat="hhmm" />)
      .find(Select)
      .props().value,
  ).toEqual({ label: '0800', value: '08:00:00' });
});
