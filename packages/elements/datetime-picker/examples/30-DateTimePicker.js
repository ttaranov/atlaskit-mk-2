// @flow
import React from 'react';
import { DateTimePicker } from '../src';
import { action } from './_';

export default () => {
  return (
    <div>
      <DateTimePicker onChange={action('onChange')} />
      <button type="button">Focusable Button</button>
    </div>
  );
};
