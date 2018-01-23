// @flow

import React from 'react';
import { colors } from '@atlaskit/theme';

import { Paragraph } from '../src';

export default () => (
  <div>
    <p>Basic paragraphs</p>
    <Paragraph />
    <Paragraph />
    <Paragraph />

    <p>Changing color via inheritance</p>
    <div style={{ color: colors.P500 }}>
      <Paragraph />
      <Paragraph />
      <Paragraph />
    </div>

    <p>Changing color via props</p>
    <Paragraph color={colors.N200} />
    <Paragraph color={colors.B300} />
    <Paragraph color={colors.R500} />

    <p>With a strong appearance</p>
    <Paragraph appearance="strong" />
    <Paragraph appearance="strong" color={colors.P500} />
    <Paragraph appearance="strong" color={colors.Y500} />
  </div>
);
