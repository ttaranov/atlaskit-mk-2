// @flow
import React from 'react';
import type { Node } from 'react';
import { colors, themed } from '@atlaskit/theme';
import { getBorderRadius } from './utils';
import type { AppearanceType, SizeType } from '../types';

// if image is loading, we hide the image so it doesn't obscure the gray loading
// block until the source image is loaded.
const getBackgroundColor = ({ isLoading }: { isLoading: boolean }) =>
  isLoading ? themed({ light: colors.N40, dark: colors.DN50 }) : 'transparent';

type SlotArgs = {|
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
}: SlotArgs) => (
  <span
    style={{
      backgroundColor: getBackgroundColor({ isLoading }),
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : null,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      borderRadius: getBorderRadius({ appearance, size }),
      display: 'flex',
      flex: '1 1 100%',
      height: '100%',
      width: '100%',
    }}
    role={role}
    aria-label={label}
  />
);

type SvgArgs = {
  appearance: AppearanceType,
  size: SizeType,
  children: Node,
  // allowing other props to be spread onto svg
};

export const Svg = ({ appearance, size, children, ...otherProps }: SvgArgs) => (
  <svg
    style={{
      backgroundColor: getBackgroundColor({ isLoading: false }),
      borderRadius: getBorderRadius({ appearance, size }),
      height: '100%',
      width: '100%',
    }}
    {...otherProps}
  >
    {children}
  </svg>
);
