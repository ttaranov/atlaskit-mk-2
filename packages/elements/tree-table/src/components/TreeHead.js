// @flow
import React, { PureComponent, Component, type ElementType } from 'react';

import { type DataFunction } from './../types';
import { TreeHead as StyledTreeHead } from '../styled';

type Props = {
  children: Array<ElementType>,
  width?: number,
};

export default class TreeHead extends PureComponent<Props> {
  render() {
    return (
      <StyledTreeHead width={this.props.width}>
        {this.props.children}
      </StyledTreeHead>
    );
  }
}
