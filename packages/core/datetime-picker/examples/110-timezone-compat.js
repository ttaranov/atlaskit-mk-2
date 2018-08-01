// @flow
import React from 'react';
import moment from 'moment';
import { DateTimePicker } from '../src';

// 8 AM in GMT+8
const jiraServerValueConvertedToHKTime = '2018-05-02T08:00:00.000+0800';

const logValue = value => console.log(value);

const parseValue = (value, date, time, zone) => {
  const parsed = moment(value).parseZone();
  const returnObject = {
    dateValue: parsed.isValid() ? parsed.format('YYYY-MM-DD') : date,
    timeValue: parsed.isValid() ? parsed.format('HH:mm') : time,
    zoneValue: parsed.isValid() ? parsed.format('ZZ') : zone,
  };
  return returnObject;
};

export default () => (
  <DateTimePicker
    onChange={logValue}
    parseValue={parseValue}
    defaultValue={jiraServerValueConvertedToHKTime}
  />
);
