// @flow

import React from 'react';
import { gridSize } from '@atlaskit/theme';

const listBaseStyles = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingTop: `${gridSize()}px`,
  width: `${gridSize() * 5}px`,
};

export const PrimaryItemsList = (props: *) => (
  <div
    css={{ ...listBaseStyles, paddingBottom: `${gridSize() * 2}px` }}
    {...props}
  />
);

export const FirstPrimaryItemWrapper = (props: *) => (
  <div css={{ paddingBottom: `${gridSize() * 2}px` }} {...props} />
);

export const SecondaryItemsList = (props: *) => (
  <div
    css={{ ...listBaseStyles, paddingBottom: `${gridSize()}px` }}
    {...props}
  />
);
