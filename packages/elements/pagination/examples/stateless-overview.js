// @flow

/* eslint-disable no-console */
import React from 'react';
import { PaginationStateless } from '../src';

export default () => (
  <PaginationStateless
    current={4}
    total={10}
    onSetPage={page => console.log(page)}
  />
);
