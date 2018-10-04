//@flow
import React, { Component } from 'react';
import { PaddedButton } from './styled';
import type { NavigatorPropsType } from '../../types';

export default class Navigator extends Component<NavigatorPropsType> {
  render() {
    //$FlowFixMe - removing all the props that are accepted by button but not page navigators
    const { appearance, ...rest } = this.props;
    return <PaddedButton {...rest} appearance="subtle" />;
  }
}
