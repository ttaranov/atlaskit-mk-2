// @flow
import React from 'react';
import { colors, themed } from '@atlaskit/theme';
import { getBorderRadius } from './utils';

// if image is loading, we hide the image so it doesn't obscure the gray loading
// block until the source image is loaded.
const getBackgroundColor = ({ isLoading }: { isLoading: boolean }) =>
  isLoading ? themed({ light: colors.N40, dark: colors.DN50 }) : 'transparent';

// eslint-disable-next-line react/prop-types, no-unused-vars
export const Span = ({
  children,
  style,
  isLoading,
  appearance,
  ...otherProps
}) => (
  <span
    style={{
      backgroundColor: getBackgroundColor(otherProps),
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      borderRadius: getBorderRadius({ appearance, ...otherProps }),
      display: 'flex',
      flex: '1 1 100%',
      height: '100%',
      width: '100%',
      ...style,
    }}
    {...otherProps}
  >
    {children}
  </span>
);

// eslint-disable-next-line react/prop-types, no-unused-vars
export const Svg = ({ children, appearance, ...otherProps }) => (
  <svg
    style={{
      backgroundColor: getBackgroundColor(otherProps),
      borderRadius: getBorderRadius(otherProps),
      height: '100%',
      width: '100%',
    }}
    {...otherProps}
  >
    {children}
  </svg>
);
