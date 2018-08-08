// @flow
import React from 'react';
import { css } from 'emotion';

import { AVATAR_SIZES, AVATAR_RADIUS, BORDER_WIDTH } from './constants';

type Props = {
  size: number,
  appearance: string,
  color: string,
  weight: string,
};

export default (props: Props) => (
  <div
    className={css({
      width: `${AVATAR_SIZES[props.size]}px;`,
      height: `${AVATAR_SIZES[props.size]}px;`,
      display: 'inline-block;',
      borderRadius:
        props.appearance === 'square'
          ? `${AVATAR_RADIUS[props.size]}px`
          : '50%',
      backgroundColor: props.color || 'currentColor',
      border: `${BORDER_WIDTH[props.size]}px solid transparent;`,
      opacity: props.weight === 'strong' ? 0.3 : 0.15,
    })}
    {...props}
  />
);
