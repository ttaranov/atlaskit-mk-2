// @flow
import React from 'react';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import type { NavigatorPropsType } from '../../types';
import Navigator from './navigator';

export function LeftNavigator(props: NavigatorPropsType) {
  const defaultLeftNavigatorProps = {
    children: <ChevronLeftLargeIcon />,
    isDisabled: false,
    label: 'previous',
    onClick: () => {},
  };
  return <Navigator {...defaultLeftNavigatorProps} {...props} />;
}

export function RightNavigator(props: NavigatorPropsType) {
  const defaultRightNavigatorProps = {
    children: <ChevronRightLargeIcon />,
    isDisabled: false,
    label: 'next',
    onClick: () => {},
  };
  return <Navigator {...defaultRightNavigatorProps} {...props} />;
}
