// @flow
import type { ComponentType } from 'react';

type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

type Icon = {|
  iconSize: IconSize,
  icon: ComponentType<{ label: string, size: IconSize }>,
|};

export type IconTypeMap = {|
  connectivity: Icon,
  confirmation: Icon,
  info: Icon,
  warning: Icon,
  error: Icon,
|};

export type IconType =
  | 'connectivity'
  | 'confirmation'
  | 'info'
  | 'warning'
  | 'error';
