// @flow

import React from 'react';
import Paginate from '../';

export default () => (
  <div>
    <Paginate
      defaultCurrent={2}
      total={5}
      onSetPage={e => console.log('page changed', e)}
      i18n={{ prev: 'Previous', next: 'Next' }}
    />
  </div>
);
