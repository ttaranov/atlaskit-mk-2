// @flow
import React from 'react';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import type { NavigatorPropsType } from '../../types';
import Navigator from './navigator';

export function LeftNavigator(props: NavigatorPropsType) {
  const defaultProps = {
    children: <ChevronLeftLargeIcon />,
    isDisabled: false,
    label: 'previous',
  };
  return <Navigator {...defaultProps} {...props} />;
}

export function RightNavigator(props: NavigatorPropsType) {
  const defaultProps = {
    children: <ChevronRightLargeIcon />,
    isDisabled: false,
    label: 'next',
  };
  return <Navigator {...defaultProps} {...props} />;
}
