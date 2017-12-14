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

describe('Date', () => {
  it('should render the component', () => {
    const wrapper = shallow(
      <DateComponent month={month} year={year}>
        {date}
      </DateComponent>,
    );
    expect(wrapper.length).toBeGreaterThan(0);
  });

  it('should prevent default event actions on mouse down', () => {
    const wrapper = shallow(
      <DateComponent month={month} year={year}>
        {date}
      </DateComponent>,
    );
    const spy = jest.fn();

    wrapper.simulate('mousedown', {
      preventDefault: spy,
    });

    expect(spy).toHaveBeenCalled();
  });

  it('should call onClick prop when date is enabled (default scenario)', () => {
    const dummyOnClickProp = jest.fn();
    const wrapper = shallow(
      <DateComponent month={month} year={year} onClick={dummyOnClickProp}>
        {date}
      </DateComponent>,
    );

    wrapper.find(DateTd).simulate('mouseup');

    expect(dummyOnClickProp).toHaveBeenCalled();
  });

  it('should not call onClick prop when date is disabled', () => {
    const dummyOnClickProp = jest.fn();
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
});
