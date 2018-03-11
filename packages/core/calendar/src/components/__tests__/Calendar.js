// @flow

import React from 'react';
import { shallow } from 'enzyme';

import Calendar, { CalendarStateless } from '../..';

test('should call onUpdate with the iso value when a date is selected', done => {
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
