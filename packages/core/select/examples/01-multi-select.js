// @flow
import React from 'react';
import Select from '../src';
import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
const MultiExample = () => (
  <Select
    className="react-select"
    classNamePrefix="select"
    value={[...cities, ...cities]}
    options={[...cities, ...cities]}
    isMulti
    isSearchable={false}
    placeholder="Choose a City"
  />
);

export default MultiExample;
