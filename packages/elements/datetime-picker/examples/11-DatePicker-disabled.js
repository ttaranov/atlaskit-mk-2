// @flow
import React from 'react';
import { DatePicker } from '../src';
import { action } from './helpers/_';

export default () => {
  return (
    <DatePicker
      onChange={action('onChange')}
      isDisabled
    />
  );
};
