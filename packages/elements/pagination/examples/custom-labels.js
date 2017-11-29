// @flow

import React from 'react';
import Pagination from '../src';

export default () => (
  <Pagination
    total={10}
    defaultCurrent={4}
    i18n={{ prev: '← Пред', next: 'След →' }}
  />
);
