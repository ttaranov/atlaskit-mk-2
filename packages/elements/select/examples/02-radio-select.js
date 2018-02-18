// @flow
import React from 'react';
import { RadioSelect } from '../src';
import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
const RadioExample = () => (
  <RadioSelect options={cities} placeholder="Choose a City" />
);

export default RadioExample;
