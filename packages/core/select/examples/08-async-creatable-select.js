// @flow

import React from 'react';
import { AsyncCreatableSelect as AsyncCreatable } from '../src';

import { cities } from './common/data';

// you control how the options are filtered
const filter = (inputValue: string) =>
  cities.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));

// async load function using callback (promises also supported)
const loadOptions = (inputValue, callback) => {
  setTimeout(() => {
    callback(filter(inputValue));
  }, 1000);
};

const AsyncExample = () => (
  <AsyncCreatable
    defaultOptions
    loadOptions={loadOptions}
    options={cities}
    placeholder="Choose a City"
  />
);

export default AsyncExample;
