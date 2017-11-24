// @flow

import React from 'react';
import Spinner from '@atlaskit/spinner';
import { colors } from '@atlaskit/theme';

const SpinnerExample = () => (
  <div>
    <Spinner size="xlarge" />
    <Spinner size="large" />
    <Spinner size="medium" />
    <Spinner size="small" />
    <span
      style={{
        padding: '7px',
        backgroundColor: colors.DN30,
        display: 'inline-block',
      }}
    >
      <Spinner invertColor />
    </span>
  </div>
);

export default SpinnerExample;
