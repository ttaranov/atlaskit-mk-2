// @flow
/* eslint-disable react/prop-types */

import React from 'react';
import { gridSize, math } from '@atlaskit/theme';

const getAlignment = p => (p.followsIcon ? 'baseline' : 'center');
const gridSizeDiv2 = math.divide(gridSize, 2);
const getMargin = p => (p.spacing === 'none' ? 0 : `0 ${gridSizeDiv2(p)}px`);

const ButtonContent = props => {
  const style = {
    alignItems: getAlignment(props),
    alignSelf: getAlignment(props),
    flex: '1 1 auto',
    margin: getMargin(props),
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  return <span style={style}>{props.children}</span>;
};

export default ButtonContent;
