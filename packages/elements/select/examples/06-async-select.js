// @flow

import React from 'react';
import Async from 'react-select/lib/Async';
import { withValue } from 'react-value';

import { cities } from './common/data';

// `withValue` manages onChange & value properties for brevity
const AsyncSelect = withValue(Async);

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
  <div>
    <AsyncSelect
      defaultOptions
      loadOptions={loadOptions}
      options={cities}
      placeholder="Choose a City"
    />
  </div>
);

export default AsyncExample;
