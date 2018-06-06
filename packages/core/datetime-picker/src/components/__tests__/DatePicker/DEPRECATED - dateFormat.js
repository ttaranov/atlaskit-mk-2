// @flow

import React from 'react';
import { shallow } from 'enzyme';
import Select from '@atlaskit/select';
import DatePicker from '../../DatePicker';

test('default', () => {
  expect(
    shallow(<DatePicker value="2018-01-01" />)
      .find(Select)
      .props().value,
  ).toEqual({ label: '2018/01/01', value: '2018-01-01' });
});

test('custom', () => {
  expect(
    shallow(<DatePicker value="2018-01-01" dateFormat="YYMMDD" />)
      .find(Select)
      .props().value,
  ).toEqual({ label: '180101', value: '2018-01-01' });
});
