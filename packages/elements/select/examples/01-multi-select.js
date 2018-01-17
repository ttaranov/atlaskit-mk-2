// @flow
import React from 'react';
import { Select } from './common/components';
import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
export default () => (
  <Select options={cities} isMulti placeholder="Choose a City" />
);
