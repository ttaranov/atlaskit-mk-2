// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';
import {
  BORDER_WIDTH,
  ICON_OFFSET,
  SQUARE_ICON_OFFSET,
  ICON_SIZES,
} from './constants';
import type {
  AppearanceType,
  SizeType,
  SupportedSizeWithAnIcon,
} from '../types';
import { getAvatarDimensions, getInnerStyles } from './utils';

// OUTER WRAPPER
// eslint-disable-next-line react/prop-types
type OuterArgs = {
  children: Node,
  size: SizeType,
  stackIndex: ?number,
};

export default ({ children, size, stackIndex }: OuterArgs) => {
  const sizeValue: string = `${getAvatarDimensions(
    { size },
    {
      includeBorderWidth: true,
      sizeOnly: true,
    },
  )}px`;
  return (
    <div
      style={{
        display: 'inline-block',
        position: 'relative',
        outline: 0,
        width: sizeValue,
        height: sizeValue,
        zIndex: stackIndex,
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
type LayoutArgs = {
  appearance: AppearanceType,
  size: SupportedSizeWithAnIcon,
};

// TODO: do not have all icon sizes!
const getPresenceLayout = ({ appearance, size }: LayoutArgs) => {
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

type PresenceArgs = LayoutArgs & {
  children: Node,
};

export const PresenceWrapper = (args: PresenceArgs) => (
  <span
    style={{
      pointerEvents: 'none',
      position: 'absolute',
      ...getPresenceLayout(args),
    }}
  >
    {args.children}
  </span>
);

// STATUS WRAPPER
const getStatusLayout = ({ appearance, size }: LayoutArgs) => {
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

type StatusArgs = LayoutArgs & {
  children: Node,
};

// eslint-disable-next-line react/prop-types
export const StatusWrapper = (args: StatusArgs) => (
  <span
    style={{
      position: 'absolute',
      ...getStatusLayout(args),
    }}
  >
    {args.children}
  </span>
);
