//@flow
import React, { Component } from 'react';
import { PaddedButton } from './styled';
import type { NavigatorPropsType } from '../../types';

export default class Navigator extends Component<NavigatorPropsType> {
  render() {
    return <PaddedButton {...this.props} appearance="subtle" />;
  }
}
