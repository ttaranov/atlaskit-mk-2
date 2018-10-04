//@flow
import React, { Component } from 'react';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import Navigator from './navigator';
import type { NavigatorPropsType } from '../../types';

export default class RightNavigator extends Component<NavigatorPropsType> {
  static defaultProps = {
    ariaLabel: 'next',
    children: <ChevronRightLargeIcon />,
    isDisabled: false,
  };
  render() {
    return <Navigator {...this.props} />;
  }
}
