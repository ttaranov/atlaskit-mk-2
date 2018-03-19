// @flow

import React from 'react';
import Pagination from '../src';

export default () => (
  <Pagination
    value={10}
    defaultValue={4}
    onChange={e => console.log('page changed', e)}
    i18n={{ prev: '← Пред', next: 'След →' }}
  />
);
