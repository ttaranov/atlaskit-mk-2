// @flow
import React from 'react';
import Select from '../src';
import type { GroupType } from '../src/types';

const selectItems: Array<GroupType> = [
  {
    heading: 'Cities',
    items: [],
  },
];

export default () => (
  <Select
    items={selectItems}
    label="Choose your favourite"
    shouldFitContainer
  />
);
