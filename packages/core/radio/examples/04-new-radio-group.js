// @flow
import React from 'react';
import RadioGroup from '../src/RadioGroup';

const radioValues = [
  { name: 'color', value: 'blue', label: 'Blue' },
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'purple', label: 'Purple' },
];

export default () => (
  <RadioGroup
    label={'Pick a color'}
    defaultSelected={radioValues[0].value}
    items={radioValues}
  />
);
