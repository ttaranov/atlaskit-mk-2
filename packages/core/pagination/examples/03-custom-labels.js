// @flow

import React from 'react';
import Pagination from '../src';

export default () => (
  <Pagination
    defaultValue={4}
    total={10}
    onChange={e => console.log('page changed', e)}
    i18n={{ prev: '← Пред', next: 'След →' }}
  />
);
