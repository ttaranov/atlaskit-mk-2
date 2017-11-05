// @flow
import React from 'react';
import { TimePicker } from '../src';
import { action } from './_';

export default () => {
  return (
    <div>
      <TimePicker onChange={action('onChange')} />
      <button type="button">Focusable Button</button>
    </div>
  );
};
