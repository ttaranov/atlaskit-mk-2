// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';

import { getMonthName } from '../util';
import Calendar, { CalendarStateless } from '..';
import { Announcer } from '../styled/Calendar';
import { MonthAndYear } from '../styled/Heading';
import DateComponent from '../components/Date';

const now = new Date();
const nowMonth = now.getMonth() + 1;
const nowYear = now.getFullYear();

describe('Stateful component', () => {
  it('should call onUpdate with the iso value when a date is selected', done => {
    const expectedIso = '2017-10-25';
    const wrapper = shallow(
      <Calendar
        onUpdate={iso => {
          expect(iso).toBe(expectedIso);
          done();
        }}
      />,
    );

    wrapper
      .find(CalendarStateless)
      .props()
      .onSelect({ iso: expectedIso });
  });
});

describe('Stateless component', () => {
  it('should render the component', () => {
    const wrapper = shallow(<CalendarStateless />);
    expect(wrapper.length).toBeGreaterThan(0);
    expect(wrapper.find(Announcer)).toHaveLength(1);
    expect(wrapper.find(DateComponent).length).toBeGreaterThan(0);
  });

  it('should highlight current date', () => {
    const wrapper = mount(<CalendarStateless />);
    expect(
      wrapper
        .find(MonthAndYear)
        .at(0)
        .text()
        .includes(`${getMonthName(nowMonth)} ${nowYear}`),
    ).toBe(true);
  });

  it('should call onSelect', done => {
    const wrapper = shallow(
      <CalendarStateless
        month={1}
        year={2016}
        onSelect={({ day, month, year, iso }) => {
          expect(day).toBe(1);
          expect(month).toBe(1);
          expect(year).toBe(2016);
          expect(iso).toBe('2016-01-01');
          done();
        }}
      />,
    );
    wrapper
      .find(DateComponent)
      .find({
        children: 1,
        sibling: false,
      })
      .simulate('click', {
        day: 1,
        month: 1,
        year: 2016,
      });
  });

  it('specifying selected days should select the specified days', () => {
    const wrapper = mount(
      <CalendarStateless
        month={1}
        year={2016}
        selected={['2016-01-01', '2016-01-02']}
      />,
    );

    expect(
      wrapper.find({
        children: 1,
        selected: true,
      }),
    ).toHaveLength(1);

    expect(
      wrapper.find({
        children: 2,
        selected: true,
      }),
    ).toHaveLength(1);
  });
});
