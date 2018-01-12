// @flow
import React from 'react';
import { RadioSelect } from './common/components';
import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
export default () => (
  <RadioSelect options={cities} placeholder="Choose a City" />
);
