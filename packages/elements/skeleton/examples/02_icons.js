// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';

import { Icon } from '../src';

export default () => (
  <div>
    <p>Basic icons of different sizes</p>
    <Icon size="small" />
    <Icon size="medium" />
    <Icon size="large" />
    <Icon size="xlarge" />

    <p>Changing color via inheritance</p>
    <div style={{ color: colors.P500 }}>
      <Icon size="small" />
      <Icon size="medium" />
      <Icon size="large" />
      <Icon size="xlarge" />
    </div>

    <p>Changing color via props</p>
    <Icon color={colors.G500} size="small" />
    <Icon color={colors.B300} size="medium" />
    <Icon color={colors.R500} size="large" />
    <Icon color={colors.N200} size="xlarge" />
  </div>
);
