// @flow
import React, { PureComponent, type Node } from 'react';

import { TreeRowContainer } from '../styled';

type Props = {
  children: Array<Node>,
};

export default class TreeHeads extends PureComponent<Props> {
  render() {
    return <TreeRowContainer>{this.props.children}</TreeRowContainer>;
  }
}
