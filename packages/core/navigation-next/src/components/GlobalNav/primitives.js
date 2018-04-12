// @flow

import React from 'react';
import { gridSize } from '@atlaskit/theme';

export const FirstItemWrapper = (props: *) => (
  <div css={{ paddingBottom: `${gridSize() * 2}px` }} {...props} />
);
