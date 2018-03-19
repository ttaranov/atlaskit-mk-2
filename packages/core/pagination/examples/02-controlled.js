// @flow

import React from 'react';
import Pagination from '../src';

export default () => (
  <Pagination value={6} total={10} onChange={page => console.log(page)} />
);
