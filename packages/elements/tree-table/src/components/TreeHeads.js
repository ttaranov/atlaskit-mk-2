// @flow
import React, { PureComponent, Component, type ElementType } from 'react';

import { TreeRowContainer } from '../styled';
import { type DataFunction } from './../types';

type Props = {
  children: Array<ElementType>,
};

export default class TreeHeads extends PureComponent<Props> {
  render() {
    return <TreeRowContainer>{this.props.children}</TreeRowContainer>;
  }
}
