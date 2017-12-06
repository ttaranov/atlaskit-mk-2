// @flow

import React from 'react';
import Pagination from '../src';

export default () => (
  <Pagination
    defaultCurrent={6}
    total={10}
    onSetPage={page => console.log(page)}
  />
);
