//@flow
import React, { Component } from 'react';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import type { NavigatorPropsType } from '../../types';
import Navigator from './navigator';

export default class LeftNavigator extends Component<NavigatorPropsType> {
  static defaultProps = {
    ariaLabel: 'previous',
    children: <ChevronLeftLargeIcon />,
    isDisabled: false,
  };
  render() {
    return <Navigator {...this.props} />;
  }
}
