// @flow

/* eslint-disable no-console */
import React from 'react';
import { PaginationStateless } from '../';

export default () => (
  <PaginationStateless
    current={4}
    total={10}
    onSetPage={page => console.log(page)}
  />
);
