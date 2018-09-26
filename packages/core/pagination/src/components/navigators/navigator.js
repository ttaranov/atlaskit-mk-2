//@flow
import React, { Component } from 'react';
import { PaddedButton } from './styled';
import type { PagePropsType } from '../../types';

export default class Navigator extends Component<PagePropsType> {
  render() {
    //$FlowFixMe
    const { appearance, ...rest } = this.props;
    return <PaddedButton {...rest} appearance="subtle" />;
  }
}
