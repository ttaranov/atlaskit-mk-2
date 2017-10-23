// @flow
import React from 'react';
import { DatePicker } from '../src';
import { action } from './helpers/_';

export default function Component() {
  return (
    <DatePicker
      onChange={action('onChange')}
      isDisabled
    />
  );
}
