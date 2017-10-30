// @flow
import React from 'react';
import { DatePicker } from '../src';
import { action } from './helpers/_';

export default () => {
  return (
    <DatePicker
      onChange={action('onChange')}
      disabled={['2017-10-10', '2017-10-11', '2017-10-12']}
    />
  );
};
