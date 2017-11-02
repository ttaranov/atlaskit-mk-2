// @flow
import React from 'react';
import { DatePicker } from '../src';
import { action } from './_';

export default () => {
  return (
    <div>
      <DatePicker onChange={action('onChange')} />
      <button type="button">Focusable Button</button>
    </div>
  );
};
