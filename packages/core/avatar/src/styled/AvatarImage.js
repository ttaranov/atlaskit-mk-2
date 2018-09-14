// @flow

import React, { type Node } from 'react';
import styled from 'styled-components';
import { colors, Theme } from '@atlaskit/theme';
import theme from '../theme';
import type { AppearanceType, SizeType } from '../types';

const shapeGroupBackgroundColors = { light: colors.N50, dark: colors.DN100 };
export const ShapeGroup = styled.g`
  & circle,
  & rect {
    fill: ${props => shapeGroupBackgroundColors[props.mode]};
  }
  & g {
    fill: ${colors.background};
  }
`;

type SlotProps = {|
  appearance: AppearanceType,
  isLoading: boolean,
  size: SizeType,
  role: string,
  label: ?string,
  backgroundImage: ?string,
|};

export const Slot = ({
  isLoading,
  appearance,
  size,
  backgroundImage,
  label,
  role,
}: SlotProps) => (
  <Theme state={{ appearance, isLoading, size }} values={theme}>
    {({ backgroundColor, borderRadius }) => (
      <span
        style={{
          backgroundColor,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : null,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          borderRadius,
          display: 'flex',
          flex: '1 1 100%',
          height: '100%',
          width: '100%',
        }}
        role={role}
        aria-label={label}
      />
    )}
  </Theme>
);

type SvgProps = {
  appearance: AppearanceType,
  size: SizeType,
  children: Node,
};

export const Svg = ({
  appearance,
  size,
  children,
  ...otherProps
}: SvgProps) => (
  <Theme state={{ appearance, size, isLoading: false }} values={theme}>
    {({ backgroundColor, borderRadius }) => (
      <svg
        style={{
          backgroundColor,
          borderRadius,
          height: '100%',
          width: '100%',
        }}
        {...otherProps}
      >
        {children}
      </svg>
    )}
  </Theme>
);
