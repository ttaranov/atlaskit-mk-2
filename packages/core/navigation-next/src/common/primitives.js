// @flow

import React from 'react';
import { transitionTimingFunction, transitionDuration } from './constants';

type ShadowProps = { isBold?: boolean, isOverDarkBg?: boolean };
export const Shadow = ({ isBold, isOverDarkBg, ...props }: ShadowProps) => {
  let width = isOverDarkBg ? 16 : 12;
  if (isBold) width = isOverDarkBg ? 32 : 24;

  const colorStops = isOverDarkBg
    ? 'rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 75%'
    : 'rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 66%';

  return (
    <div
      css={{
        background: `linear-gradient(to left, ${colorStops})`,
        bottom: 0,
        left: -width,
        opacity: isBold ? 1 : 0.5,
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        transitionDuration,
        transitionProperty: 'left, opacity, width',
        transitionTimingFunction,
        width,
      }}
      {...props}
    />
  );
};
