// @flow
import React from 'react';
import moment from 'moment';
import { DatePicker } from '../src';

const logValue = value => console.log(value);

const formatDisplayLabel = (value, dateFormat) => {
  moment.locale('fr');
  return moment(value).format(dateFormat);
};

export default () => (
  <DatePicker
    onChange={logValue}
    dateFormat="MMMM/DD"
    placeholder="MMMM/DD"
    formatDisplayLabel={formatDisplayLabel}
  />
);
