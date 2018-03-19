// @flow

import React from 'react';
import Pagination from '../src';

export default () => (
  <Pagination
    defaultCurrent={1}
    total={10}
    onSetPage={e => console.log('page changed', e)}
  />
);
