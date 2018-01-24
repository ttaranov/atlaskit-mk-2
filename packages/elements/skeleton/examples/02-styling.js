// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';

import { Icon } from '../src';
import { ComponentDisplay, Gap } from './util';

export default () => (
  <ComponentDisplay>
    <div style={{ color: colors.G500 }}>
      <Icon />
      <Gap />
      <Icon size="large" />
      <Gap />
      <Icon size="xlarge" />
    </div>
    <div>
      <Icon />
      <Gap />
      <Icon size="large" color={colors.T500} />
      <Gap />
      <Icon size="xlarge" color={colors.Y500} />
    </div>
    <div>
      <Icon weight="strong" />
      <Gap />
      <Icon size="large" weight="strong" color={colors.T500} />
      <Gap />
      <Icon size="xlarge" weight="strong" color={colors.Y500} />
    </div>
  </ComponentDisplay>
);
