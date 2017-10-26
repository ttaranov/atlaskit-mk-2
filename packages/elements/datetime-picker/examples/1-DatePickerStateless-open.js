// @flow
import React from 'react';
import { DatePickerStateless } from '../src';
import { action } from './helpers/_';

export default () => {
  return (
    <DatePickerStateless
      isOpen
      value="2017-08-09"
      displayValue="9 August, 2017"

      onIconClick={action('onIconClick')}

      onInputKeyDown={action('onInputKeyDown')}
      onInputChange={action('onInputChange')}

      onCalendarChange={action('onCalendarChange')}
      onCalendarSelect={action('onCalendarSelect')}

      day={10}
      month={8}
      year={2017}
      today={'2017-08-08'}
      selected={['2017-08-07']}
      disabled={['2017-08-06', '2017-08-05']}
    />
  );
};
