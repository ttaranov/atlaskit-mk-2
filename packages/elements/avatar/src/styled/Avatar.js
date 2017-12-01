// @flow
import React from 'react';
import styled from 'styled-components';
import {
  BORDER_WIDTH,
  ICON_OFFSET,
  SQUARE_ICON_OFFSET,
  ICON_SIZES,
} from './constants';
import { getAvatarDimensions, getInnerStyles } from './utils';

// OUTER WRAPPER
// eslint-disable-next-line react/prop-types
export default ({ children, ...otherProps }) => {
  const size = `${getAvatarDimensions(otherProps, {
    includeBorderWidth: true,
    sizeOnly: true,
  })}px`;
  return (
    <div
      style={{
        display: 'inline-block',
        position: 'relative',
        outline: 0,
        width: size,
        height: size,
        ...(otherProps.stackIndex ? { zIndex: otherProps.stackIndex } : {}),
      }}
    >
      {children}
    </div>
  );
};

// INNER WRAPPER
export const Inner = styled.div`
  ${getInnerStyles};
`;

// PRESENCE WRAPPER
const getPresenceLayout = ({ appearance, size }) => {
  const presencePosition =
    appearance === 'square' ? -(BORDER_WIDTH[size] * 2) : ICON_OFFSET[size];
  const presenceSize = ICON_SIZES[size];

  return {
    bottom: `${presencePosition}px`,
    height: `${presenceSize}px`,
    right: `${presencePosition}px`,
    width: `${presenceSize}px`,
  };
};

// eslint-disable-next-line react/prop-types
export const PresenceWrapper = ({ children, ...otherProps }) => (
  <span
    style={{
      pointerEvents: 'none',
      position: 'absolute',
      ...getPresenceLayout(otherProps),
    }}
  >
    {children}
  </span>
);

// STATUS WRAPPER
const getStatusLayout = ({ appearance, size }) => {
  const statusPosition =
    appearance === 'square' ? SQUARE_ICON_OFFSET[size] : ICON_OFFSET[size];
  const statusSize = ICON_SIZES[size];

  return {
    height: `${statusSize}px`,
    right: `${statusPosition}px`,
    top: `${statusPosition}px`,
    width: `${statusSize}px`,
  };
};

// eslint-disable-next-line react/prop-types
export const StatusWrapper = ({ children, ...otherProps }) => (
  <span
    style={{
      position: 'absolute',
      ...getStatusLayout(otherProps),
    }}
  >
    {children}
  </span>
);
