// @flow
import React from 'react';
import Spinner from '@atlaskit/spinner';
import { akColorN100 } from '@atlaskit/util-shared-styles';
import Tabs from '../src';

export default () => (
  <div
    style={{
      height: 200,
      margin: '16px auto',
      border: `1px dashed ${akColorN100}`,
      display: 'flex',
    }}
  >
    <Tabs
      tabs={[
        {
          label: 'Spinner should be centered',
          defaultSelected: true,
          content: (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flex: '1 0 auto',
                justifyContent: 'center',
              }}
            >
              <Spinner size="medium" />
            </div>
          ),
        },
      ]}
    />
  </div>
);
