// @flow
import React from 'react';
import moment from 'moment';
import { DateTimePicker } from '../src';

// 1 AM in GMT+1
const jiraServerValue = '2018-05-02T01:00:00.000+0100';

// 8 AM in GMT+8
const jiraServerValueConvertedToHKTime = '2018-05-02T08:00:00.000+0800';

// Local timezone is GMT+10
// We want to show "8:00am" instead of "10:00am" (8 - 10)
// So we subtract 2hrs from 08:00
// 8 AM in GMT+10
const myValue = '2018-05-02T08:00:00.000';

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
  <div>
    <div>
      The date string we get from the server (rendered in local timezone):
    </div>
    <div>{jiraServerValue}</div>
    <DateTimePicker onChange={logValue} value={jiraServerValue} />
    <div>
      The same date as above but in a different timezone. The picker below still
      renders it in the local timezone:
    </div>
    <div>{jiraServerValueConvertedToHKTime}</div>
    <DateTimePicker
      onChange={logValue}
      parseValue={parseValue}
      value={jiraServerValueConvertedToHKTime}
    />
    <DateTimePicker
      onChange={logValue}
      parseValue={parseValue}
      defaultValue={jiraServerValueConvertedToHKTime}
    />
    <div>Trick the datetime picker into rendering the correct time.</div>
    <div>{myValue}</div>
    <DateTimePicker onChange={logValue} value={myValue} />
  </div>
);
