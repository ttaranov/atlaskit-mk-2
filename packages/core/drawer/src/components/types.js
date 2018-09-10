// @flow

import type { ComponentType, Node } from 'react';
import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type BaseProps = {
  children: Node,
  icon?: ComponentType<*>,
  width: 'full' | 'narrow' | 'wide',
};
export type DrawerPrimitiveProps = BaseProps & {
  onClose?: (SyntheticMouseEvent<*>) => void,
};

export type DrawerProps = BaseProps &
  WithAnalyticsEventsProps & {
    onClose?: (
      SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
      analyticsEvent: any,
    ) => void,
    onKeyDown?: (SyntheticKeyboardEvent<*>) => void,
    isOpen: boolean,
    unmountOnExit?: boolean,
  };

export type CloseTrigger = 'backButton' | 'blanket' | 'escKey';
