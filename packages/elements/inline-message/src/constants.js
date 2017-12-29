// @flow
import { gridSize } from '@atlaskit/theme';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import type { IconTypeMap } from './types';

export const itemSpacing: number = gridSize() / 2;

export const typesMapping: IconTypeMap = {
  connectivity: {
    icon: WarningIcon,
    iconSize: 'medium',
  },
  confirmation: {
    icon: CheckCircleIcon,
    iconSize: 'small',
  },
  info: {
    icon: WarningIcon,
    iconSize: 'medium',
  },
  warning: {
    icon: WarningIcon,
    iconSize: 'medium',
  },
  error: {
    icon: WarningIcon,
    iconSize: 'medium',
  },
};
