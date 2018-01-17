// @flow
import React from 'react';
import { MultiSelectStateless } from '../src';
import type { GroupType } from '../src/types';

const array: Array<GroupType> = [];
export default () => (
  <MultiSelectStateless
    items={array}
    label="Always loading..."
    isLoading
    loadingMessage="Custom loading message"
    isOpen
    shouldFitContainer
  />
);
