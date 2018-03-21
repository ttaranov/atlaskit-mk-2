// @flow

import React from 'react';
import Pagination from '../src';

export default () => (
  <Pagination
    defaultValue={5}
    total={10}
    onChange={e => console.log('page changed', e)}
  />
);
