// @flow
/* eslint-disable react/prop-types */

import React from 'react';
import { gridSize, math } from '@atlaskit/theme';

const getMargin = props => {
  if (props.spacing === 'none') return 0;
  if (props.isOnlyChild) return `0 -${math.divide(gridSize, 4)(props)}px`;

  return `0 ${math.divide(gridSize, 2)(props)}px`;
};

const IconWrapper = props => {
  const style = {
    alignSelf: 'center',
    display: 'flex',
    flexShrink: 0,
    lineHeight: 0,
    fontSize: 0,
    margin: getMargin(props),
    userSelect: 'none',
  };
  return <span style={style}>{props.children}</span>;
};

export default IconWrapper;
