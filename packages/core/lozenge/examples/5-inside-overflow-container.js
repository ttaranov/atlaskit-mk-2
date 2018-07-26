// @flow
import React from 'react';
import Lozenge from '../src';

export default () => (
  <div>
    <p>
      <div style={{ width: 150, overflow: 'hidden' }}>
        <Lozenge appearance="success" maxWidth={'100%'}>
          very very very wide text which truncates
        </Lozenge>
      </div>
    </p>
  </div>
);
