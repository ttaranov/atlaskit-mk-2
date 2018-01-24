// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';

import { Avatar } from '../src';
import { Gap } from './util';

export default () => (
  <div>
    <p>Basic circle avatars of different sizes</p>
    <Avatar size="xsmall" />
    <Gap />
    <Avatar size="small" />
    <Gap />
    <Avatar size="medium" />
    <Gap />
    <Avatar size="large" />
    <Gap />
    <Avatar size="xlarge" />
    <Gap />
    <Avatar size="xxlarge" />

    <p>Basic square avatars of different sizes</p>
    <Avatar appearance="square" size="xsmall" />
    <Gap />
    <Avatar appearance="square" size="small" />
    <Gap />
    <Avatar appearance="square" size="medium" />
    <Gap />
    <Avatar appearance="square" size="large" />
    <Gap />
    <Avatar appearance="square" size="xlarge" />
    <Gap />
    <Avatar appearance="square" size="xxlarge" />

    <p>Changing color via inheritance</p>
    <div style={{ color: colors.P500 }}>
      <Avatar size="xsmall" />
      <Gap />
      <Avatar size="small" />
      <Gap />
      <Avatar size="medium" />
      <Gap />
      <Avatar size="large" />
      <Gap />
      <Avatar size="xlarge" />
      <Gap />
      <Avatar size="xxlarge" />
    </div>

    <p>Changing color via props</p>
    <Avatar color={colors.Y500} size="xsmall" />
    <Gap />
    <Avatar color={colors.G500} size="small" />
    <Gap />
    <Avatar color={colors.B300} size="medium" />
    <Gap />
    <Avatar color={colors.R500} size="large" />
    <Gap />
    <Avatar color={colors.N200} size="xlarge" />
    <Gap />
    <Avatar color={colors.T500} size="xxlarge" />

    <p>With a strong weight</p>
    <Avatar weight="strong" color={colors.Y500} size="xsmall" />
    <Gap />
    <Avatar weight="strong" color={colors.G500} size="small" />
    <Gap />
    <Avatar weight="strong" color={colors.B300} size="medium" />
    <Gap />
    <Avatar weight="strong" color={colors.R500} size="large" />
    <Gap />
    <Avatar weight="strong" color={colors.N200} size="xlarge" />
    <Gap />
    <Avatar weight="strong" color={colors.T500} size="xxlarge" />
  </div>
);
