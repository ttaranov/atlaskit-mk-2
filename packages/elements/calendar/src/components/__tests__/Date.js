// @flow

import React from 'react';
import { shallow } from 'enzyme';
import DateComponent from '../Date';
import { DateTd } from '../../styled/Date';

// Date is required to construct DateComponent
const now = new Date();
const date: number = now.getDate();
const month: number = now.getMonth() + 1;
const year: number = now.getFullYear();

const dummyOnClickProp = jest.fn();

test('should not call onClick prop when date is disabled', () => {
  const wrapper = shallow(
    <DateComponent
      disabled
      month={month}
      year={year}
      onClick={dummyOnClickProp}
    >
      {date}
    </DateComponent>,
  );

  wrapper.find(DateTd).simulate('mouseup');

  expect(dummyOnClickProp).not.toHaveBeenCalled();
});

test('should call onClick prop when date is enabled (default scenario)', () => {
  const wrapper = shallow(
    <DateComponent month={month} year={year} onClick={dummyOnClickProp}>
      {date}
    </DateComponent>,
  );

  wrapper.find(DateTd).simulate('mouseup');

  expect(dummyOnClickProp).toHaveBeenCalled();
});
