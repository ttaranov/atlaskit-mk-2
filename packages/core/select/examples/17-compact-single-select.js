// @flow
import React from 'react';
import { AsyncSelect as Select } from '../src';

const promiseOptions = inputValue =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { label: 'Adelaide', value: 'adelaide' },
        { label: 'Brisbane', value: 'brisbane' },
        { label: 'Canberra', value: 'canberra' },
        { label: 'Darwin', value: 'darwin' },
        { label: 'Hobart', value: 'hobart' },
        { label: 'Melbourne', value: 'melbourne' },
        { label: 'Perth', value: 'perth' },
        { label: 'Sydney', value: 'sydney' },
      ]);
    }, 1000);
  });

const SingleExample = () => (
  <Select
    isClearable
    className="compact-select"
    classNamePrefix="react-select"
    isSearchable
    spacing="compact"
    loadOptions={promiseOptions}
    placeholder="Choose a City"
  />
);

export default SingleExample;
